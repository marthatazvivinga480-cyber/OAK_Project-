"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

type ScanResult =
  | { status: "idle" }
  | { status: "success"; participant: { first_name: string; last_name: string; organization: string; role: string }; check_in_time: string }
  | { status: "error"; reason: string };

export default function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastScannedRef = useRef<string | null>(null);

  const [manualCode, setManualCode] = useState("");
  const [result, setResult] = useState<ScanResult>({ status: "idle" });
  const [checking, setChecking] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  async function submitCode(code: string) {

    if (lastScannedRef.current === code) return;
    lastScannedRef.current = code;

    setChecking(true);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr_code_id: code }),
      });
      const body = await res.json();

      if (!res.ok) {
        setResult({ status: "error", reason: body.error || "QR Code Not Recognized" });
      } else {
        setResult({ status: "success", participant: body.participant, check_in_time: body.check_in_time });
      }
    } catch {
      setResult({ status: "error", reason: "Network error" });
    } finally {
      setChecking(false);
      
      setTimeout(() => { lastScannedRef.current = null; }, 3000);
    }
  }

  async function startCamera() {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        scanLoop();
      }
    } catch (err) {
      setCameraError(
        err instanceof Error ? err.message : "Could not access camera"
      );
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setCameraActive(false);
  }

  function scanLoop() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationRef.current = requestAnimationFrame(scanLoop);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code?.data) {
      submitCode(code.data);
    }

    animationRef.current = requestAnimationFrame(scanLoop);
  }

  useEffect(() => {
    return () => stopCamera(); // clean up camera on unmount
  }, []);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="aspect-square bg-black rounded-lg overflow-hidden relative">
        <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
        <canvas ref={canvasRef} className="hidden" />
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/80 text-sm px-4 text-center">
            {cameraError ? (
              <p className="text-red-400">{cameraError}</p>
            ) : (
              <p>Camera not started</p>
            )}
            <button
              onClick={startCamera}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md"
            >
              Start camera
            </button>
          </div>
        )}
      </div>

      {cameraActive && (
        <button
          onClick={stopCamera}
          className="text-sm text-gray-600 underline"
        >
          Stop camera
        </button>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (manualCode.trim()) submitCode(manualCode.trim());
        }}
        className="flex gap-2"
      >
        <input
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="OAK-2026-XXXX-XXXX"
          className="border rounded-md px-3 py-2 flex-1 font-mono text-sm"
        />
        <button
          type="submit"
          disabled={checking}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-4 py-2 rounded-md"
        >
          Check
        </button>
      </form>

      {result.status === "success" && (
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-green-700 font-medium mb-2">Participant Successfully Checked In</p>
          <p className="text-sm text-black">
            {result.participant.first_name} {result.participant.last_name} · {result.participant.organization} · {result.participant.role}
          </p>
          <p className="text-sm text-gray-700">{result.check_in_time}</p>
        </div>
      )}

      {result.status === "error" && (
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-red-600 font-medium mb-2">QR Code Not Recognized</p>
          <p className="text-sm text-black">{result.reason}</p>
        </div>
      )}
    </div>
  );
}