import Link from 'next/link';
import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-transparent border-b border-white/20 text-white px-6 py-4 flex items-center justify-between fixed top-0 left-0 w-full z-100 shadow-md">
      <h1 className="text-2xl font-extrabold tracking-wide font-mono">Learnova</h1>
      <ul className="flex space-x-8 text-sm font-medium">
        <li className="hover:text-cyan-300 transition duration-300 cursor-pointer font-mono cursor-pointer"><Link href = "/">Home</Link></li>
        <li className="hover:text-cyan-300 transition duration-300 cursor-pointer font-mono cursor-pointer"><Link href = "/course">Course</Link></li>
      </ul>
      
    </nav>
  );
}
