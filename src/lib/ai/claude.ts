import Anthropic from "@anthropic-ai/sdk";

let cached: Anthropic | null = null;

export function claude() {
  if (cached) return cached;
  cached = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return cached;
}

export const CLAUDE_MODEL = "claude-sonnet-4-6";
