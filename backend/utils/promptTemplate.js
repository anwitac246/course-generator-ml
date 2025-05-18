function buildPrompt({ topic, goal, style, time, prior, device, level, outline, knowledge }) {
  return `
Using the information below, write an engaging and educational course text for the topic "${topic}" suitable for a ${level} learner.

Goal: ${goal}
Preferred Learning Style: ${style}
Weekly Time Commitment: ${time}
Prior Knowledge: ${prior}
Preferred Device: ${device}

Course Outline:
${outline}

Knowledge Extracted from Google Search:
${knowledge}

Write the content in a structured format with headings, explanations, examples, and actionable steps. Keep it simple but comprehensive.
`;
}

module.exports = { buildPrompt };
