import Image from "next/image";
import type { Participant } from "@/lib/types";

export default function QRCodeDisplay({
  participant,
  qrDataUrl,
}: {
  participant: Participant;
  qrDataUrl: string;
}) {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-sm p-6 text-center text-black">
      <p className="text-sm mb-1">Your entry pass</p>
      <h2 className="text-lg font-semibold mb-4">
        {participant.first_name} {participant.last_name}
      </h2>
      <Image
        src={qrDataUrl}
        alt={`QR code for ${participant.registration_id}`}
        width={192}
        height={192}
        className="mx-auto mb-4 w-48 h-48"
        unoptimized
      />
      <p className="font-mono text-sm mb-4">{participant.registration_id}</p>
      <dl className="text-left text-sm space-y-1 mb-6">
        <div className="flex justify-between">
          <dt>Organization</dt>
          <dd>{participant.organization}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Role</dt>
          <dd>{participant.role}</dd>
        </div>
      </dl>

      <a
        href={qrDataUrl}
        download={`${participant.registration_id}.png`}
        className="block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md"
      >
        Download QR code
      </a>
    </div>
  );
}