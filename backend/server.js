
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { generateCourse } from './service.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Course generation backend is running!");
});
app.post('/generate-course', async (req, res) => {
  try {
    const { topic, goal, style, time, prior, device, level } = req.body;

    if (!topic || !goal || !style || !time || !prior || !level) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const courseData = await generateCourse({ topic, goal, style, time, prior, device, level });

    res.json(courseData);
  } catch (error) {
    console.error('Error in /generate-course:', error);
    res.status(500).json({ error: 'Failed to generate course' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
