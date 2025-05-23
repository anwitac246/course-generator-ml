const axios = require('axios');
require('dotenv').config();
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
//console.log('GROQ API Key:', GROQ_API_KEY);

/**
 * Generates a course outline using the Groq API.
 * @param {Object} formData - The user's input data.
 * @returns {Promise<string[]>} - An array of outline topics.
 */
async function generateOutline(formData) {
  const prompt = `Generate a detailed course outline for the topic "${formData.topic}" tailored for a ${formData.level} learner. The course should help achieve the goal: "${formData.goal}". Provide the outline as a numbered list of topics.`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const outlineText = response.data.choices[0].message.content;
    const outline = outlineText.split('\n').filter(line => line.trim() !== '');
    return outline;
  } catch (error) {
    console.error('Error generating outline:', error.message);
    throw new Error('Failed to generate course outline.');
  }
}

/**
 * Fetches relevant content for a given topic using Google Custom Search API.
 * @param {string} topic - The topic to search for.
 * @returns {Promise<string>} - Concatenated content from top search results.
 */
async function fetchContentForTopic(topic) {
  try {
    const searchResponse = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: GOOGLE_API_KEY,
        cx: GOOGLE_CX,
        q: topic,
      },
    });

    const snippets = searchResponse.data.items
      .map(item => item.snippet)
      .join('\n');
    return snippets;
  } catch (error) {
    console.error(`Error fetching content for topic "${topic}":`, error.message);
    return '';
  }
}

/**
 * Generates detailed course text for each topic in the outline.
 * @param {string[]} outline - The course outline topics.
 * @param {Object} formData - The user's input data.
 * @returns {Promise<string>} - The complete course text.
 */
async function generateCourseText(outline, formData) {
  let courseText = '';

  for (const topic of outline) {
    const content = await fetchContentForTopic(topic);
    const prompt = `Using the following information:\n\n${content}\n\nWrite a comprehensive explanation on "${topic}" suitable for a ${formData.level} learner aiming to "${formData.goal}". Add all you know about that topic in extreme detail like the guy wants to do a PhD`;

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama2-70b-chat',
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const topicText = response.data.choices[0].message.content;
      courseText += `\n\n## ${topic}\n\n${topicText}`;
    } catch (error) {
      console.error(`Error generating course text for topic "${topic}":`, error.message);
      courseText += `\n\n## ${topic}\n\nContent not available due to an error.`;
    }
  }

  return courseText;
}

/**
 * Fetches relevant YouTube videos for the course topics.
 * @param {string[]} outline - The course outline topics.
 * @returns {Promise<Object[]>} 
 */
async function fetchYouTubeVideos(outline) {
  const videos = [];

  for (const topic of outline) {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: YOUTUBE_API_KEY,
          q: topic,
          part: 'snippet',
          maxResults: 1,
          type: 'video',
        },
      });

      const item = response.data.items[0];
      if (item) {
        videos.push({
          videoId: item.id.videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.default.url,
        });
      }
    } catch (error) {
      console.error(`Error fetching YouTube video for topic "${topic}":`, error.message);
    }
  }

  return videos;
}

module.exports = {
  generateOutline,
  generateCourseText,
  fetchYouTubeVideos,
};
