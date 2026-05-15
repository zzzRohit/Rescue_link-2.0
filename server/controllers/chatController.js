import { CHAT_SYSTEM_PROMPT } from '../prompts/chatSystemPrompt.js';

const defaultChips = ['Show me step-by-step', 'Can I feed it?', 'Find a rescuer near me'];

const cleanHistory = (history = []) => history
  .filter((message) => ['user', 'assistant'].includes(message.role) && message.content)
  .slice(-10)
  .map((message) => ({ role: message.role, content: String(message.content).slice(0, 1200) }));

const parseChips = (text) => {
  const lines = text.trim().split('\n');
  const chipLineIndex = lines.findLastIndex((line) => line.trim().startsWith('CHIPS:'));
  if (chipLineIndex === -1) return { message: text.trim(), chips: defaultChips };

  try {
    const raw = lines[chipLineIndex].trim().replace(/^CHIPS:\s*/, '');
    const chips = JSON.parse(raw);
    return {
      message: lines.slice(0, chipLineIndex).join('\n').trim(),
      chips: Array.isArray(chips) && chips.length ? chips.slice(0, 3) : defaultChips
    };
  } catch {
    return { message: lines.filter((_, index) => index !== chipLineIndex).join('\n').trim(), chips: defaultChips };
  }
};

const sendEvent = (res, payload) => {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
};

export const chat = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  const { message, animal, situationChips = [], conversationHistory = [] } = req.body;
  const animalLabel = animal ? animal[0].toUpperCase() + animal.slice(1) : 'Not selected';
  const contextMessage = `[Animal: ${animalLabel} | Situation: ${situationChips.join(', ') || 'Not specified'}]\n\n${message}`;
  const messages = [
    { role: 'system', content: CHAT_SYSTEM_PROMPT },
    ...cleanHistory(conversationHistory),
    { role: 'user', content: contextMessage }
  ];

  try {
    if (!process.env.OPENROUTER_API_KEY) {
      const fallback = 'Do this now:\nKeep a safe distance and move people, pets, and traffic away from the animal. If it appears injured, keep the area quiet and shaded without touching it.\n\nAvoid:\nDo not feed, pour water, or try to pick it up unless a rescuer instructs you.\n\nNext steps:\nCall a local wildlife rescuer and share your location.\n\nAI guidance - contact a wildlife rescuer for serious injuries.';
      sendEvent(res, { chunk: fallback });
      sendEvent(res, { done: true, chips: defaultChips });
      return res.end();
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
        'X-Title': 'RescueLink'
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'google/gemini-flash-1.5',
        messages,
        max_tokens: 500,
        temperature: 0.3,
        stream: true
      })
    });

    if (!response.ok || !response.body) {
      sendEvent(res, { error: 'Something went wrong. Try again.' });
      return res.end();
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    for await (const chunk of response.body) {
      buffer += decoder.decode(chunk, { stream: true });
      const events = buffer.split('\n\n');
      buffer = events.pop() || '';

      for (const event of events) {
        const line = event.split('\n').find((item) => item.startsWith('data: '));
        if (!line) continue;
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          const token = parsed.choices?.[0]?.delta?.content || '';
          if (token) {
            fullText += token;
            sendEvent(res, { chunk: token });
          }
        } catch {
          // Ignore malformed upstream stream fragments.
        }
      }
    }

    const { chips } = parseChips(fullText);
    sendEvent(res, { done: true, chips });
    res.end();
  } catch {
    sendEvent(res, { error: 'Something went wrong. Try again.' });
    res.end();
  }
};
