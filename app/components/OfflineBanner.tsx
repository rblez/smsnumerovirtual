"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className={`fixed top-0 left-0 right-0 z-60 px-4 py-3 ${
          isOnline ? "bg-emerald-500" : "bg-amber-500"
        } text-white`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="w-5 h-5" />
              <span className="font-medium">Conexión restablecida</span>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5" />
              <span className="font-medium">Sin conexión a Internet</span>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>("unknown");
  const [effectiveType, setEffectiveType] = useState<string>("4g");

  useEffect(() => {
    const updateNetworkStatus = () => {
      setIsOnline(navigator.onLine);
      
      // @ts-expect-error - Network Information API not fully typed
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn) {
        setConnectionType(conn.type || "unknown");
        setEffectiveType(conn.effectiveType || "4g");
      }
    };

    updateNetworkStatus();

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    
    // @ts-expect-error navigator.connection is not in all browser types
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      conn.addEventListener("change", updateNetworkStatus);
    }

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
      if (conn) {
        conn.removeEventListener("change", updateNetworkStatus);
      }
    };
  }, []);

  return { isOnline, connectionType, effectiveType };
}
