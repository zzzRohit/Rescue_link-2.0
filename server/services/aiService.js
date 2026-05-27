import dotenv from 'dotenv';

dotenv.config();

const fallbackModel = 'google/gemini-2.0-flash-001';
const normalizeModel = (model) => (
  model === 'google/gemini-flash-latest' ? fallbackModel : model
);

const SYSTEM_PROMPT = `You are an AI animal emergency triage system for RescueLink, an animal rescue platform in India.

Analyze the animal emergency report and respond ONLY with a valid JSON object in this exact format, no markdown, no extra text:
{
  "severity": "critical" | "moderate" | "low",
  "rescuePriority": "immediate" | "within_2hrs" | "non_urgent",
  "dangerWarnings": ["string"],
  "firstAidSteps": ["string"]
}

SEVERITY RULES:
- Internally consider whether the case involves a domestic animal, stray animal, bird, wildlife animal, dangerous animal, or critical emergency.
- critical: unconscious, active bleeding, road accident, cannot move, broken limb visible
- moderate: injured but stable, orphaned baby, trapped but not immediate danger
- low: abandoned but mobile, malnourished, non-urgent sighting

firstAidSteps: exactly 3-5 specific actionable steps. Never say "take care of it."
dangerWarnings: empty array [] if no danger. Flag venomous, aggressive, large, protected, or high-risk animals.
Do NOT include text outside the JSON.`;

export const analyzeIncident = async ({ animalType, emergencyCategory, description, imageUrls = [] }) => {
  try {
    const content = [];

    for (const url of imageUrls.slice(0, 3)) {
      content.push({
        type: 'image_url',
        image_url: { url }
      });
    }

    content.push({
      type: 'text',
      text: `Animal type: ${animalType}
Emergency category: ${emergencyCategory}
Description: ${description}

Analyze this animal emergency and return the JSON triage result.`
    });

    const requestOpenRouter = (model) => fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
        'X-Title': 'RescueLink'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content }
        ],
        max_tokens: 400,
        temperature: 0.1
      })
    });

    const configuredModel = normalizeModel(process.env.OPENROUTER_MODEL || fallbackModel);
    let response = await requestOpenRouter(configuredModel);
    if (!response.ok && configuredModel !== fallbackModel) {
      const errText = await response.text();
      console.error(`OpenRouter error for ${configuredModel}:`, errText);
      response = await requestOpenRouter(fallbackModel);
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error(`OpenRouter error for ${fallbackModel}:`, errText);
      return null;
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;

    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    if (!parsed.severity || !parsed.rescuePriority) return null;

    return parsed;
  } catch (err) {
    console.error('AI analysis failed:', err.message);
    return null;
  }
};
