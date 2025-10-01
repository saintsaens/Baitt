// Define reusable instructions
const baseInstructions = [
  "Translate to French.",
  "Strictly translate; no commentary.",
  "Keep HTML tags explicitly (do not turn them into markdown).",
  "Translate in the most direct, simple way possible.",
  "Never use bold.",
  "Always use curved apostrophes (’), not straight apostrophes.",
];

// Glossary as [source, target] pairs
const glossary = [
  ["path", "chemin"],
  ["course", "module"],
  ["instructor", "référent"],
  ["path session", "session de chemin"],
  ["score", "score"],
  ["published posts", "messages publiés"],
  ["coach", "animateur"],
];

// Build glossary instructions automatically
const glossaryInstructions = glossary.map(
  ([source, target]) => `Always translate '${source}' to '${target}'.`
);

// Function to create prompt
export const createPrompt = (question) => {
  const allInstructions = [...baseInstructions, ...glossaryInstructions];
  return `${allInstructions.join(" ")}\n\nText:\n${question}`;
};
