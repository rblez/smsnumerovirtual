"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 4;
    let globe: ReturnType<typeof createGlobe> | null = null;

    if (canvasRef.current) {
      globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: 600 * 2,
        height: 600 * 2,
        phi: 0,
        theta: -0.3,
        dark: 0,
        diffuse: 1.2,
        mapSamples: 30000,
        mapBrightness: 13,
        mapBaseBrightness: 0.01,
        baseColor: [0.9, 0.88, 0.83], // #E8E1D4 in RGB
        glowColor: [0.9, 0.88, 0.83],
        markerColor: [0.18, 0.18, 0.18], // #2E2E2E
        markers: [],
        onRender: (state) => {
          state.phi = phi;
          phi += 0.0005;
        },
      });
    }

    return () => {
      if (globe) {
        globe.destroy();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600 }}
      className="absolute -right-40 top-0 z-10 aspect-square size-full max-w-fit opacity-80 transition-transform duration-500 hover:scale-105 lg:-right-20"
    />
  );
}
