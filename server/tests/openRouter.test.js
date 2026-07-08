import test from "node:test";
import assert from "node:assert/strict";
import {
  getOpenRouterModelCandidates,
  normalizeOpenRouterModel,
} from "../utils/openRouter.js";

test("normalizes legacy Gemini models to a supported fallback", () => {
  assert.equal(
    normalizeOpenRouterModel("google/gemini-flash-1.5"),
    "google/gemini-2.0-flash-001",
  );
  assert.equal(
    normalizeOpenRouterModel("google/gemini-flash-latest"),
    "google/gemini-2.0-flash-001",
  );
});

test("builds a fallback model chain when the first choice fails", () => {
  assert.deepEqual(getOpenRouterModelCandidates("google/gemini-flash-1.5"), [
    "google/gemini-2.0-flash-001",
    "google/gemini-2.0-flash-lite-001",
    "openai/gpt-4o-mini",
  ]);
});
