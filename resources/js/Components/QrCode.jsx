import { useEffect, useRef } from "react";

export default function QrCode({ startScan, onScanSuccess }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    async function startCamera() {
      if (!startScan) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current && isActive) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    }

    startCamera();

    return () => {
      // Hentikan semua track kamera dengan aman
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      isActive = false;
    };
  }, [startScan]);

  return (
    <div className="flex justify-center">
      <video ref={videoRef} className="rounded-lg shadow-lg" />
    </div>
  );
}
