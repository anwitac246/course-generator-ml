exports.generatePrompts = (inputs) => {
  const { topic, goal, style, time, prior, device, level } = inputs;

  return {
    outlinePrompt: `You are a senior educator. Create a detailed course outline for "${topic}" targeted at a ${level} learner. The learner's goal is "${goal}". Prior knowledge: "${prior}". Preferred style: "${style}". Time: "${time}". Device: "${device}".`,

    contentPrompt: `Expand on each point of the course outline for "${topic}" created earlier. Explain concepts in simple, easy-to-understand language for a ${level} learner. Adapt to style: "${style}".`,

    videoPrompt: `Suggest the best video content plan (e.g. one-shot, topic-wise, interactive) for a course on "${topic}" for a ${level} learner based on "${style}" and device "${device}".`,

    quizPrompt: `Create 5 beginner to intermediate quizzes with answers for a course on "${topic}". Ensure the questions reflect the textual content you generated.`
  };
};
