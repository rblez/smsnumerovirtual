"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator && typeof window !== "undefined") {
      // Register service worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered:", registration);

          // Check for updates every hour
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);
        })
        .catch((error) => {
          console.log("SW registration failed:", error);
        });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "SW_UPDATE") {
          // Show update available notification
          if (confirm("Hay una nueva versión disponible. ¿Actualizar ahora?")) {
            window.location.reload();
          }
        }
      });
    }
  }, []);

  return null;
}
