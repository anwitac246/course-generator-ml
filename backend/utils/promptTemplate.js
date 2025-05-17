function generatePrompts({ topic, goal, style, time, prior, device, level }) {
  return {
    outlinePrompt: `Generate a complete course outline for a ${level} learner on "${topic}" aiming to ${goal}. Prior knowledge: ${prior}. Preferred device: ${device}.`,
    contentPrompt: `Generate concise, easy-to-follow content for "${topic}" targeted at a ${level} learner who wants to ${goal}.`,
    quizPrompt: `Create a few short quizzes for a course on "${topic}" for someone with ${prior} knowledge and wants to ${goal}.`,
  };
}

module.exports = { generatePrompts };
