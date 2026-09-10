"use client";

import { useState } from "react";

export default function AdminManagePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const body = await res.json();
    setMessage(res.ok ? `Created admin: ${body.username}` : body.error);
    if (res.ok) { setUsername(""); setPassword(""); }
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <h1 className="text-2xl font-semibold text-center mb-8">Manage Admin Accounts</h1>
      <form onSubmit={handleCreate} className="max-w-sm mx-auto space-y-4">
        {message && <p className="text-sm text-center">{message}</p>}
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="New admin username" className="border rounded-md px-3 py-2 w-full" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Temporary password" className="border rounded-md px-3 py-2 w-full" />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md w-full">
          Create admin
        </button>
      </form>
    </main>
  );
}