"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook detecting physical device shakes using Web Accelerometer / DeviceMotion APIs.
 * Includes compatibility fallbacks for iOS permission configurations.
 */
export const useShakeDetection = (onShake: () => void, threshold = 12) => {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastZ: number | null = null;
    let lastTime = 0;

    const handleMotionEvent = (e: DeviceMotionEvent) => {
      const acc = e.acceleration || e.accelerationIncludingGravity;
      if (!acc) return;

      const { x, y, z } = acc;
      if (x === null || y === null || z === null) return;

      const currentTime = Date.now();
      const timeDiff = currentTime - lastTime;

      // Rate limit evaluation checks to 100ms blocks
      if (timeDiff > 100) {
        if (lastX !== null && lastY !== null && lastZ !== null) {
          const deltaX = Math.abs(x - lastX);
          const deltaY = Math.abs(y - lastY);
          const deltaZ = Math.abs(z - lastZ);

          // Standard multi-axial physical surge coefficient
          const speed = (deltaX + deltaY + deltaZ) / timeDiff * 10000;

          // If standard speed surge triggers past threshold limits
          if (speed > threshold * 10) {
            onShake();
          }
        }

        lastX = x;
        lastY = y;
        lastZ = z;
        lastTime = currentTime;
      }
    };

    const DeviceMotion = window.DeviceMotionEvent as any;
    
    if (DeviceMotion && typeof DeviceMotion.requestPermission === "function") {
      DeviceMotion.requestPermission()
        .then((permissionState: string) => {
          if (permissionState === "granted") {
            setPermissionGranted(true);
            window.addEventListener("devicemotion", handleMotionEvent);
          } else {
            setPermissionGranted(false);
          }
        })
        .catch((err: any) => {
          console.warn("DeviceMotion API permission request deferred or denied:", err);
          setPermissionGranted(false);
        });
    } else {
      // Android / Laptop standard browser event listener fallback
      setPermissionGranted(true);
      window.addEventListener("devicemotion", handleMotionEvent);
    }

    return () => {
      window.removeEventListener("devicemotion", handleMotionEvent);
    };
  }, [onShake, threshold]);

  return { permissionGranted };
};
export default useShakeDetection;
