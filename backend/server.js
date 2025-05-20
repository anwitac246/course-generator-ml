require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {
  generateOutline,
  generateCourseText,
  fetchYouTubeVideos,
} = require('./service');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Course Generator API');
});

app.post('/generate-course', async (req, res) => {
  try {
    const formData = req.body;

    const outline = await generateOutline(formData);
    const courseText = await generateCourseText(outline, formData);
    const videos = await fetchYouTubeVideos(outline);

    res.json({
      outline,
      courseText,
      videos,
    });
  } catch (error) {
    console.error('Error generating course:', error.message);
    res.status(500).json({ error: 'Failed to generate course content.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
