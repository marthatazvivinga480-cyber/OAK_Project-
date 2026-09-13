"use client";

import { useEffect, useState } from "react";

interface Admin {
  id: string;
  username: string;
  is_master: boolean;
}

export default function AdminManagePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);

  async function loadAdmins() {
    const res = await fetch("/api/admin/manage");
    if (res.ok) setAdmins(await res.json());
  }

  useEffect(() => {
    let ignore = false;

    async function fetchAdmins() {
      const res = await fetch("/api/admin/manage");
      if (!ignore && res.ok) {
        setAdmins(await res.json());
      }
    }

    void fetchAdmins();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const body = await res.json();
    setMessage(res.ok ? `Created admin: ${body.username}` : body.error);
    if (res.ok) {
      setUsername("");
      setPassword("");
      loadAdmins();
    }
  }

  async function handleRemove(id: string, name: string) {
    if (!confirm(`Remove admin "${name}"? This can't be undone.`)) return;
    const res = await fetch("/api/admin/manage", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const body = await res.json();
    if (!res.ok) {
      setMessage(body.error);
      return;
    }
    setMessage(`Removed admin: ${name}`);
    loadAdmins();
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <h1 className="text-2xl font-semibold text-center mb-8">Manage Admin Accounts</h1>

      <form onSubmit={handleCreate} className="max-w-sm mx-auto space-y-4 mb-10">
        {message && <p className="text-sm text-center">{message}</p>}
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="New admin username" className="border rounded-md px-3 py-2 w-full" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Temporary password" className="border rounded-md px-3 py-2 w-full" />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md w-full">
          Create admin
        </button>
      </form>

      <div className="max-w-sm mx-auto">
        <h2 className="font-semibold mb-3">Existing admins</h2>
        <ul className="space-y-2">
          {admins.map((admin) => (
            <li key={admin.id} className="flex items-center justify-between border rounded-md px-4 py-2">
              <span>
                {admin.username} {admin.is_master && <span className="text-xs text-gray-500">(master)</span>}
              </span>
              {!admin.is_master && (
                <button
                  onClick={() => handleRemove(admin.id, admin.username)}
                  className="text-red-600 text-sm font-medium"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}