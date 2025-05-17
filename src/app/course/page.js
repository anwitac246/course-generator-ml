'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/navbar';

export default function Course() {
  const [level, setLevel] = useState('');
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    const loadScripts = async () => {
      // Load three.js
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/three.r134.min.js';
        script.onload = () => resolve();
        script.onerror = (e) => reject(new Error('Failed to load three.js'));
        document.body.appendChild(script);
      });

      // Load vanta.globe
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/vanta.globe.min.js';
        script.onload = () => resolve();
        script.onerror = (e) => reject(new Error('Failed to load vanta.globe.js'));
        document.body.appendChild(script);
      });

      // Initialize Vanta Globe
      if (window.VANTA && window.VANTA.GLOBE) {
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

    loadScripts().catch((err) => {
      console.error('Script loading error:', err);
    });

    return () => {
      if (vantaEffect.current) vantaEffect.current.destroy();
    };
  }, []);

  return (
    <>
      <Navbar />
      <div
        ref={vantaRef}
        className="min-h-screen text-white flex items-center justify-start px-4 py-8 font-sans relative px-20"
      >
        <style>
          {`
            * {
              cursor: url('https://cdn.custom-cursor.com/db/3542/32/matrix_code_pointer.png'), auto;
            }
          `}
        </style>

        <div className="w-full max-w-xl items-left bg-white/10 backdrop-blur-md rounded-2xl shadow-xl px-8 py-10 space-y-6 border border-white/20 z-10 relative">
          <h1 className="text-4xl font-extrabold text-center text-white tracking-wide">
            Build Your Custom Course
          </h1>

          <p className="text-sm text-center text-teal-100">
            Choose your topic and expertise level to get started
          </p>

      
          <div>
            <label htmlFor="topic" className="text-white text-sm mb-2 block font-medium">
              Topic
            </label>
            <input
              type="text"
              id="topic"
              placeholder="e.g. React, Web3, AI..."
              className="w-full py-3 px-4 rounded-lg bg-white/10 text-white placeholder:text-teal-200 border border-teal-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-md"
            />
          </div>

          {/* Level Selection */}
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

          {/* Generate Button */}
          <div className="text-center">
            <button
              className="mt-2 px-8 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#006A71] to-[#48A6A7] hover:opacity-90 shadow-lg transition duration-300"
            >
              Generate Course
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
