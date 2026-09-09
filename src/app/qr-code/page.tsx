import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { getCurrentParticipant } from "@/lib/session";
import QRCodeDisplay from "@/components/QRCodeDisplay/QRCodeDisplay";

export default async function QRCodePage() {
  const participant = await getCurrentParticipant();

  if (!participant || participant.role !== "Partner" || !participant.qr_code_id) {
    redirect("/");
  }

  const qrDataUrl = await QRCode.toDataURL(participant.qr_code_id);

  return (
    <main className="min-h-screen px-6 py-12">
      <QRCodeDisplay participant={participant} qrDataUrl={qrDataUrl} />
    </main>
  );
}