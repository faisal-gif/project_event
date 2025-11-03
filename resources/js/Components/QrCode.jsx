import { useEffect, useRef, useState } from "react";

export default function QrCode({ startScan, onScanSuccess }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment"); // default kamera belakang

  // Fungsi untuk memulai kamera
  const startCamera = async () => {
    try {
      // Matikan kamera lama jika ada
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Minta kamera dengan facingMode tertentu
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Error starting camera:", err);
    }
  };

  // Jalankan kamera saat startScan aktif
  useEffect(() => {
    if (startScan) {
      startCamera();
    } else {
      // Stop kamera saat modal ditutup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [startScan, facingMode]); // restart kalau facingMode berubah

  const handleSwitchCamera = () => {
    setFacingMode(prev =>
      prev === "environment" ? "user" : "environment"
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <video ref={videoRef} className="rounded-lg shadow-lg w-full max-w-md" />
      <button
        onClick={handleSwitchCamera}
        className="btn btn-sm btn-secondary"
      >
        🔄 Ganti Kamera ({facingMode === "environment" ? "Belakang" : "Depan"})
      </button>
    </div>
  );
}
