import { useCallback, useState } from 'react';

const initialMessage = {
  role: 'assistant',
  content: "Hi! Tell me about the animal you found and what's happening.\nI'll guide you on what to do safely right now.",
  chips: ['Show me step-by-step', 'Can I feed it?', 'Find a rescuer near me']
};

const cleanAssistantText = (text) => text.replace(/\n?CHIPS:[\s\S]*$/m, '').trimEnd();

export const useChat = ({ animal, situationChips }) => {
  const [messages, setMessages] = useState([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const send = useCallback(async (content, imageUrls = []) => {
    const trimmed = content.trim();
    if ((!trimmed && !imageUrls.length) || isLoading) return;
    const displayText = trimmed || 'Please review this photo and guide me.';

    const history = messages
      .filter((message) => !message.streaming)
      .slice(-10)
      .map((message) => ({ role: message.role, content: message.content }));

    setError('');
    setIsLoading(true);
    setMessages((current) => [
      ...current,
      { role: 'user', content: displayText, images: imageUrls },
      { role: 'assistant', content: '', streaming: true, chips: [] }
    ]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: displayText, animal, situationChips, conversationHistory: history, imageUrls })
      });

      if (!response.ok || !response.body) throw new Error('Chat failed');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const event of events) {
          const line = event.split('\n').find((item) => item.startsWith('data: '));
          if (!line) continue;
          const payload = JSON.parse(line.slice(6));

          if (payload.error) throw new Error(payload.error);
          if (payload.chunk) {
            setMessages((current) => current.map((message, index) => (
              index === current.length - 1
                ? { ...message, content: cleanAssistantText(message.content + payload.chunk) }
                : message
            )));
          }
          if (payload.done) {
            setMessages((current) => current.map((message, index) => (
              index === current.length - 1
                ? { ...message, streaming: false, content: cleanAssistantText(message.content), chips: payload.chips || [] }
                : message
            )));
          }
        }
      }
    } catch {
      setError('Something went wrong. Try again.');
      setMessages((current) => current.map((message, index) => (
        index === current.length - 1
          ? { role: 'assistant', content: 'Something went wrong. Try again.', streaming: false, chips: ['Find a rescuer near me'] }
          : message
      )));
    } finally {
      setIsLoading(false);
    }
  }, [animal, isLoading, messages, situationChips]);

  return { messages, isLoading, error, send };
};
