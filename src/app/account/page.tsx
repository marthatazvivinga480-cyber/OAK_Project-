"use client";

import { useEffect, useState } from "react";

export default function AccountPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [isMaster, setIsMaster] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
        setIsMaster(data.is_master);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ text: "New passwords don't match", isError: true });
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
    const body = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setMessage({ text: body.error, isError: true });
      return;
    }

    setMessage({ text: "Password changed successfully", isError: false });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-sm mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold">My Account</h1>
          {username && (
            <p className="text-sm text-gray-500 mt-1">
              {username} {isMaster && "· Master"}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <p className={`text-sm text-center ${message.isError ? "text-red-600" : "text-green-700"}`}>
              {message.text}
            </p>
          )}
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="border rounded-md px-3 py-2 w-full"
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="border rounded-md px-3 py-2 w-full"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="border rounded-md px-3 py-2 w-full"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-6 py-3 rounded-md w-full"
          >
            {submitting ? "Changing…" : "Change password"}
          </button>
        </form>
      </div>
    </main>
  );
}