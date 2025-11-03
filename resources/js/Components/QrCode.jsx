import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { SwitchCamera, X } from "lucide-react";

export default function QrCode({ startScan, onScanSuccess, onCancel }) {
  const [cameras, setCameras] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const qrCodeScannerRef = useRef(null);
  const scannerId = "qr-reader";

  // Ambil daftar kamera saat mount
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
        } else {
          console.error("❌ Tidak ada kamera ditemukan.");
        }
      })
      .catch((err) => console.error("Gagal akses kamera:", err));
  }, []);

  // Jalankan / hentikan scanner sesuai status modal
  useEffect(() => {
    if (startScan && cameras.length > 0) {
      startScanner(cameras[currentCameraIndex].id);
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startScan, cameras, currentCameraIndex]);

  // Mulai scanner
  const startScanner = async (cameraId) => {
    if (!cameraId) return;

    setIsLoading(true);
    await stopScanner();

    const html5Qr = new Html5Qrcode(scannerId);
    qrCodeScannerRef.current = html5Qr;

    try {
      await html5Qr.start(
        cameraId,
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          console.log("✅ Hasil QR:", decodedText);
          await stopScanner();
          onScanSuccess(decodedText);
        }
      );
      setIsActive(true);
    } catch (err) {
      console.error("❌ Gagal memulai scanner:", err);
    } finally {
      setTimeout(() => setIsLoading(false), 400);
    }
  };

  // Stop kamera dengan aman
  const stopScanner = async () => {
    const scanner = qrCodeScannerRef.current;
    if (!scanner) return;

    try {
      if (scanner._isScanning) await scanner.stop();
      await scanner.clear();
    } catch (err) {
      console.warn("⚠️ Error stopScanner:", err);
    } finally {
      // Hentikan track video secara manual jika masih hidup
      const elem = document.querySelector("video");
      if (elem && elem.srcObject) {
        elem.srcObject.getTracks().forEach((t) => t.stop());
      }

      qrCodeScannerRef.current = null;
      setIsActive(false);
    }
  };

  // Ganti kamera
  const handleSwitchCamera = async () => {
    if (!cameras.length) return;
    const nextIndex = (currentCameraIndex + 1) % cameras.length;
    setCurrentCameraIndex(nextIndex);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        id={scannerId}
        className="relative w-full max-w-sm border border-gray-300 rounded-lg overflow-hidden bg-black"
        style={{ height: 400 }}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white z-10">
            <span className="loading loading-spinner loading-lg mb-2"></span>
            <p className="text-sm opacity-80">Mengaktifkan kamera...</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        {cameras.length > 1 && (
          <button
            onClick={handleSwitchCamera}
            className="btn btn-outline btn-sm flex items-center gap-2"
            disabled={!isActive || isLoading}
          >
            <SwitchCamera size={16} />
            Ganti Kamera
          </button>
        )}
        <button
          onClick={async () => {
            await stopScanner();
            onCancel();
          }}
          className="btn btn-error btn-sm text-white flex items-center gap-2"
          disabled={isLoading}
        >
          <X size={16} />
          Tutup
        </button>
      </div>
    </div>
  );
}
