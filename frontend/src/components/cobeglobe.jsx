"use client";
import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";

export function Cobe() {
  const canvasRef = useRef();
  const containerRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    let phi = 0;
    let width = 0;
    const onResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [251 / 255, 100 / 255, 21 / 255],
      glowColor: [1.2, 1.2, 1.2],
      markers: [],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => (canvasRef.current.style.opacity = "1"), 500);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "600px",
        aspectRatio: "1",
        position: "relative",
        marginLeft: isMobile ? "auto" : "0",
        marginRight: isMobile ? "auto" : "0",
        left: isMobile ? "0" : "300px",
        top: "110px",
        transition: "all 0.5s ease",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
