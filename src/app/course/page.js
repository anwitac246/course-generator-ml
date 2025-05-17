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
    device: ''
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
        })
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
          backgroundColor: 0x000000
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
        level
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
      <div
        ref={vantaRef}
        className="min-h-screen text-white flex flex-col items-center justify-start px-4 py-8 font-sans relative px-20"
      >
        <style>
          {`* { cursor: url('https://cdn.custom-cursor.com/db/3542/32/matrix_code_pointer.png'), auto; }`}
        </style>

        <div className="w-full justify-start max-w-xl bg-white/10 backdrop-blur-md rounded-2xl shadow-xl px-8 py-10 space-y-6 border border-white/20 z-10 relative">
          <h1 className="text-4xl font-extrabold text-center text-white tracking-wide">Build Your Custom Course</h1>
          <p className="text-sm text-center text-teal-100">Choose your topic and expertise level to get started</p>

          {['topic', 'goal', 'style', 'time', 'prior', 'device'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="text-white text-sm mb-2 block font-medium">
                {field === 'topic' ? 'Topic' :
                  field === 'goal' ? 'Your Goal' :
                  field === 'style' ? 'Preferred Learning Style' :
                  field === 'time' ? 'Weekly Time Commitment' :
                  field === 'prior' ? 'Prior Knowledge' :
                  'Preferred Device (Optional)'}
              </label>
              <input
                type="text"
                id={field}
                value={formData[field]}
                onChange={handleChange}
                required={field !== 'device'}
                placeholder={
                  field === 'topic' ? 'e.g. React, Web3, AI, Python...' :
                  field === 'goal' ? 'e.g. Prepare for a job, build a project...' :
                  field === 'style' ? 'e.g. One-shot videos, interactive...' :
                  field === 'time' ? 'e.g. 4 hours per week, 1 hour daily...' :
                  field === 'prior' ? 'e.g. No experience, some HTML/CSS...' :
                  'e.g. Mobile, desktop, tablet...'
                }
                className="w-full py-3 px-4 rounded-lg bg-white/10 text-white placeholder:text-teal-200 border border-teal-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-md"
              />
            </div>
          ))}

          <div className="flex justify-center gap-3 flex-wrap">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`px-5 py-2 rounded-lg border text-sm font-medium transition-all duration-300 ${level === lvl
                    ? 'bg-cyan-400 text-black border-cyan-300 shadow-md'
                    : 'bg-white/5 text-white border-teal-300 hover:bg-cyan-600 hover:text-black'
                  }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-2 px-8 py-3 cursor-pointer rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#006A71] to-[#48A6A7] hover:opacity-90 shadow-lg transition duration-300"
            >
              {loading ? 'Generating...' : 'Generate Course'}
            </button>
          </div>
        </div>

        {course && (
          <div className="mt-10 w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-white space-y-6 z-10">
            <h2 className="text-2xl font-bold">Outline</h2>
            <pre className="whitespace-pre-wrap text-sm">{course.outline}</pre>

            <h2 className="text-2xl font-bold">Course Text</h2>
            <pre className="whitespace-pre-wrap text-sm">{course.courseText}</pre>

            <h2 className="text-2xl font-bold">Recommended Videos</h2>
            <pre className="whitespace-pre-wrap text-sm">{course.videos}</pre>

            <h2 className="text-2xl font-bold">Quiz</h2>
            <pre className="whitespace-pre-wrap text-sm">{course.quiz}</pre>
          </div>
        )}
      </div>
    </>
  );
}
