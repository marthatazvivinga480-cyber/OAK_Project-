import QRScanner from "@/components/QRScanner/QRScanner";

export default function CheckInPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <h1 className="text-2xl font-semibold text-center mb-8">
        Event check-in
      </h1>
      <QRScanner />
    </main>
  );
}