"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.get("username"),
        password: form.get("password"),
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Login failed");
      setSubmitting(false);
      return;
    }

    router.push("/checkin");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
        <h1 className="text-xl font-semibold text-center">Coordination Team Login</h1>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <input name="username" placeholder="Username" required className="border rounded-md px-3 py-2 w-full" />
        <input name="password" type="password" placeholder="Password" required className="border rounded-md px-3 py-2 w-full" />
        <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-6 py-3 rounded-md w-full">
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}