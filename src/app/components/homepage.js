'use client';

import { useEffect, useRef } from "react";
import Script from "next/script";
import Navbar from "./navbar";

export default function Homepage() {
  const vantaRef = useRef(null);

  useEffect(() => {
    const loadVanta = () => {
      if (typeof window.VANTA !== "undefined" && !window.vantaEffect) {
        window.vantaEffect = window.VANTA.DOTS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x60000,
          color: 0x202eff,
          color2: 0x20ffd4,
          size: 2.7,
          spacing: 22.0,
        });
      }
    };

    if (typeof window !== "undefined") {
      if (window.VANTA) {
        loadVanta();
      } else {
        const script = document.createElement("script");
        script.src = "/vanta.dots.min.js";
        script.onload = loadVanta;
        document.body.appendChild(script);
      }
    }

    return () => {
      if (window.vantaEffect) {
        window.vantaEffect.destroy();
        window.vantaEffect = null;
      }
    };
  }, []);

  return (
    <>
      <Script src="/three.r134.min.js" strategy="beforeInteractive" />
      
  
      <div
        ref={vantaRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
          width: "100vw",
          height: "100vh",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        <div
          style={{
            height: "calc(100vh - 60px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "2rem",
            color: "white",
          }}
        >
          Welcome to Learnova!
        </div>
      </div>
    </>
  );
}
