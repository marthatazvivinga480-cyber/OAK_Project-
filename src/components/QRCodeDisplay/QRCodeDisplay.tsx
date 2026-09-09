"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import type { Participant } from "@/lib/types";

export default function QRCodeDisplay({ participant }: { participant: Participant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${participant.registration_id}.png`;
    link.click();
  }

  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-sm p-6 text-center text-black">
      <p className="text-sm mb-1">Your entry pass</p>
      <h2 className="text-lg font-semibold mb-4">
        {participant.first_name} {participant.last_name}
      </h2>
      <div className="flex justify-center mb-4">
        <QRCodeCanvas
          ref={canvasRef}
          value={participant.qr_code_id ?? ""}
          size={192}
          level="M"
        />
      </div>
      <p className="font-mono text-sm mb-4">{participant.registration_id}</p>
      <dl className="text-left text-sm space-y-1 mb-6">
        <div className="flex justify-between"><dt>Organization</dt><dd>{participant.organization}</dd></div>
        <div className="flex justify-between"><dt>Role</dt><dd>{participant.role}</dd></div>
      </dl>
      <button
        onClick={handleDownload}
        className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md"
      >
        Download QR code
      </button>
    </div>
  );
}