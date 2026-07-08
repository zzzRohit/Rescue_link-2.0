const fallbackModels = [
  "google/gemini-2.0-flash-001",
  "google/gemini-2.0-flash-lite-001",
  "openai/gpt-4o-mini",
];

export const normalizeOpenRouterModel = (model) => {
  if (!model) return fallbackModels[0];
  if (
    model === "google/gemini-flash-latest" ||
    model === "google/gemini-flash-1.5"
  ) {
    return fallbackModels[0];
  }
  return model;
};

export const getOpenRouterModelCandidates = (model) => {
  const primary = normalizeOpenRouterModel(model);
  const candidates = [primary];

  if (!fallbackModels.includes(primary)) {
    candidates.push(...fallbackModels);
  } else {
    const index = fallbackModels.indexOf(primary);
    candidates.push(...fallbackModels.slice(index + 1));
  }

  return [...new Set(candidates)].slice(0, 3);
};
