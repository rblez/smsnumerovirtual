"use client";

import { useEffect } from "react";

export function useDevToolsProtection() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === "production") {
        e.preventDefault();
      }
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    const handleKeyDown = (e: KeyboardEvent) => {
      if (process.env.NODE_ENV !== "production") return;
      
      // F12
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I or Ctrl+Shift+J
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j")) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (view source)
      if ((e.ctrlKey || e.metaKey) && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
        return false;
      }
    };

    // Detect DevTools opening
    const detectDevTools = () => {
      if (process.env.NODE_ENV !== "production") return;
      
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        // DevTools detected - redirect or show warning
        console.clear();
        window.location.href = "/";
      }
    };

    // Prevent debugger statements
    const preventDebugger = () => {
      if (process.env.NODE_ENV !== "production") return;
      
      setInterval(() => {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) {
          window.location.href = "/";
        }
      }, 100);
    };

    // Add listeners only in production
    if (process.env.NODE_ENV === "production") {
      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("keydown", handleKeyDown);
      window.addEventListener("resize", detectDevTools);
      detectDevTools();
      preventDebugger();
    }

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", detectDevTools);
    };
  }, []);
}
