import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;

async function callLLM(prompt) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    }
  );
  return response.data.choices[0].message.content;
}


async function searchYouTube(query) {
  const url = `https://www.googleapis.com/youtube/v3/search`;
  const params = {
    part: 'snippet',
    q: query,
    key: YOUTUBE_API_KEY,
    maxResults: 5,
    type: 'video',
  };

  const response = await axios.get(url, { params });
  return response.data.items.map((item) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails.medium.url,
  }));
}

async function googleSearch(query) {
  const url = `https://www.googleapis.com/customsearch/v1`;
  const params = {
    key: process.env.GOOGLE_API_KEY,
    cx: GOOGLE_CX,
    q: query,
    num: 5,
  };

  const response = await axios.get(url, { params });
  return response.data.items || [];
}


export async function generateCourse({ topic, goal, style, time, prior, device, level }) {
 
  const prompt = `
You are an expert course designer.

Create a course outline and detailed course text for the following parameters:

Topic: ${topic}
Goal: ${goal}
Preferred Style: ${style}
Weekly Time Commitment: ${time}
Prior Knowledge: ${prior}
Expertise Level: ${level}
Preferred Device: ${device || 'Not specified'}

Please provide:

1. A course outline with chapters and topics.
2. Detailed course text for learning.
3. Recommended YouTube videos on the topic.
4. A short quiz at the end with 5 questions and answers.

Format your response as JSON with keys: outline, courseText, videos, quiz.
`;

  const llmResponse = await callLLM(prompt);

  let parsedResponse;
  try {
    parsedResponse = JSON.parse(llmResponse);
  } catch {
 
    const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
    parsedResponse = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  }

  let videos = [];
  if (parsedResponse && parsedResponse.videos) {
    videos = parsedResponse.videos;
  } else {
    videos = await searchYouTube(topic);
  }

  return {
    outline: parsedResponse?.outline || 'No outline generated',
    courseText: parsedResponse?.courseText || 'No course text generated',
    videos,
    quiz: parsedResponse?.quiz || 'No quiz generated',
  };
}
