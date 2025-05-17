'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';

export default function Course() {
  const [level, setLevel] = useState('');
  const [formData, setFormData] = useState({
    topic: '',
    goal: '',
    style: '',
    time: '',
    prior: '',
    device: '',
  });
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    const loadScripts = async () => {
      await Promise.all([
        new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = '/three.r134.min.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load three.js'));
          document.body.appendChild(script);
        }),
        new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = '/vanta.globe.min.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load vanta.globe.js'));
          document.body.appendChild(script);
        }),
      ]);

      if (window.VANTA?.GLOBE) {
        vantaEffect.current = window.VANTA.GLOBE({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x48a6a7,
          backgroundColor: 0x000000,
        });
      }
    };

    loadScripts().catch(console.error);

    return () => {
      if (vantaEffect.current) vantaEffect.current.destroy();
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleGenerate = async () => {
    if (!level || !formData.topic || !formData.goal || !formData.style || !formData.time || !formData.prior) {
      alert('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    setCourse(null);

    try {
      const response = await axios.post('http://localhost:5000/generate-course', {
        ...formData,
        level,
      });

      setCourse(response.data);
    } catch (err) {
      console.error('Failed to generate course:', err);
      alert('Something went wrong generating your course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div ref={vantaRef} className="min-h-screen w-full text-white relative font-sans">
        <style>
          {`* { cursor: url('https://cdn.custom-cursor.com/db/3542/32/matrix_code_pointer.png'), auto; }`}
        </style>

        <div className="relative z-10 flex flex-col lg:flex-row w-full min-h-screen p-8 gap-10">
      
          <div className="w-full lg:w-1/2 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl px-8 py-10 space-y-6 border border-white/20">
            <h1 className="text-3xl font-bold text-white text-center">Build Your Custom Course</h1>
            <p className="text-sm text-center text-teal-100">Choose your topic and expertise level to get started</p>

            {['topic', 'goal', 'style', 'time', 'prior', 'device'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="text-white text-sm mb-2 block font-medium">
                  {field === 'topic'
                    ? 'Topic'
                    : field === 'goal'
                    ? 'Your Goal'
                    : field === 'style'
                    ? 'Preferred Learning Style'
                    : field === 'time'
                    ? 'Weekly Time Commitment'
                    : field === 'prior'
                    ? 'Prior Knowledge'
                    : 'Preferred Device (Optional)'}
                </label>
                <input
                  type="text"
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required={field !== 'device'}
                  placeholder={
                    field === 'topic'
                      ? 'e.g. React, Web3, AI, Python...'
                      : field === 'goal'
                      ? 'e.g. Prepare for a job, build a project...'
                      : field === 'style'
                      ? 'e.g. One-shot videos, interactive...'
                      : field === 'time'
                      ? 'e.g. 4 hrs/week, 1 hr/day...'
                      : field === 'prior'
                      ? 'e.g. No experience, basic HTML...'
                      : 'e.g. Mobile, desktop...'
                  }
                  className="w-full py-2 px-4 rounded-lg bg-white/10 text-white placeholder:text-teal-200 border border-teal-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            ))}

            <div className="flex justify-center gap-2 flex-wrap">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-300 ${
                    level === lvl
                      ? 'bg-cyan-400 text-black border-cyan-300 shadow-md'
                      : 'bg-white/5 text-white border-teal-300 hover:bg-cyan-600 hover:text-black'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-4 px-6 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#006A71] to-[#48A6A7] hover:opacity-90 shadow-lg transition duration-300"
            >
              {loading ? 'Generating...' : 'Generate Course'}
            </button>
          </div>

       
          {course && (
            <div className="w-full lg:w-2/3 space-y-8">
              <div className="bg-black/60 rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-2"> Outline</h2>
                <pre className="whitespace-pre-wrap text-sm">{course.outline}</pre>
              </div>

              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-2"> Course Text</h2>
                <pre className="whitespace-pre-wrap text-sm">{course.courseText || 'No course content available.'}</pre>
              </div>

              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-4">🎥 Recommended Videos</h2>
                {Array.isArray(course.videos) && course.videos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {course.videos.map(({ videoId, title, channel, thumbnail }) => (
                      <div key={videoId} className="bg-white/10 p-3 rounded-lg shadow-md">
                        <a
                          href={`https://www.youtube.com/watch?v=${videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mb-2"
                        >
                          <img src={thumbnail} alt={title} className="w-full rounded-md" />
                        </a>
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <p className="text-sm text-teal-300">{channel}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No videos available</p>
                )}
              </div>

              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-2"> Quiz</h2>
                {course.quiz ? (
                  <pre className="whitespace-pre-wrap text-sm">
                    {typeof course.quiz === 'string'
                      ? course.quiz
                      : JSON.stringify(course.quiz, null, 2)}
                  </pre>
                ) : (
                  <p>No quiz available</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
