"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, KeyRound, Trash2, Shield, UserRound, RefreshCw } from "lucide-react";

interface Admin {
  id: string;
  username: string;
  is_master: boolean;
}

type Panel = "create" | "reset" | null;

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [createMsg, setCreateMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [creating, setCreating] = useState(false);

  const [resetTarget, setResetTarget] = useState<Admin | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetMsg, setResetMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [resetting, setResetting] = useState(false);

  const [activePanel, setActivePanel] = useState<Panel>(null);

  async function loadAdmins() {
    const res = await fetch("/api/admin/manage");
    if (res.ok) {
      setAdmins(await res.json());
    }
    setLoadingAdmins(false);
  }

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/manage")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled) {
          setAdmins(data);
          setLoadingAdmins(false);
        }
      })
      .catch(() => setLoadingAdmins(false));
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateMsg(null);
    setCreating(true);
    const res = await fetch("/api/admin/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername, password: newPassword }),
    });
    const body = await res.json();
    setCreating(false);
    if (!res.ok) {
      setCreateMsg({ text: body.error, isError: true });
      return;
    }
    setCreateMsg({ text: `Created admin account: ${body.username}`, isError: false });
    setNewUsername("");
    setNewPassword("");
    await loadAdmins();
  }

  async function handleRemove(admin: Admin) {
    if (!confirm(`Remove "${admin.username}"? This cannot be undone.`)) return;
    const res = await fetch("/api/admin/manage", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: admin.id }),
    });
    const body = await res.json();
    if (!res.ok) {
      alert(body.error);
      return;
    }
    await loadAdmins();
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!resetTarget) return;
    setResetMsg(null);
    setResetting(true);
    const res = await fetch("/api/admin/manage/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: resetTarget.id, new_password: resetPassword }),
    });
    const body = await res.json();
    setResetting(false);
    if (!res.ok) {
      setResetMsg({ text: body.error, isError: true });
      return;
    }
    setResetMsg({ text: `Password reset for ${resetTarget.username}`, isError: false });
    setResetPassword("");
  }

  function openResetFor(admin: Admin) {
    setResetTarget(admin);
    setResetMsg(null);
    setResetPassword("");
    setActivePanel("reset");
  }

  function openCreate() {
    setCreateMsg(null);
    setActivePanel("create");
  }

  function closePanel() {
    setActivePanel(null);
    setResetTarget(null);
  }

  return (
    <main className="min-h-screen bg-[#F4F5F7] px-4 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-2xl space-y-6">

        <div className="flex items-center gap-3">
          <Link
            href="/account"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#1C2E5A1A] bg-white text-[#6B7590] transition-colors hover:text-[#162E55]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          </Link>
          <div>
            <h1 className="font-chillax text-lg font-semibold text-[#0E1726]">
              Manage Admin Accounts
            </h1>
            <p className="text-xs text-[#6B7590]">My Account › Manage Admins</p>
          </div>
        </div>

        <section className="rounded-2xl border border-[#1C2E5A1A] bg-white">
          <div className="flex items-center justify-between border-b border-[#1C2E5A1A] px-6 py-4">
            <div>
              <h2 className="font-chillax font-semibold text-[#0E1726]">Admin Accounts</h2>
              <p className="mt-0.5 text-xs text-[#6B7590]">
                {loadingAdmins ? "Loading..." : `${admins.length} account${admins.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 rounded-xl bg-[#162E55] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              New admin
            </button>
          </div>

          {loadingAdmins ? (
            <div className="px-6 py-8 text-center text-sm text-[#6B7590]">Loading accounts...</div>
          ) : admins.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-[#6B7590]">No admin accounts found.</div>
          ) : (
            <ul className="divide-y divide-[#1C2E5A1A]">
              {admins.map((admin) => (
                <li key={admin.id} className="flex items-center gap-3 px-6 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF1F5] text-sm font-semibold text-[#162E55] font-chillax">
                    {admin.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0E1726]">
                      {admin.username}
                    </p>
                    <span
                      className={
                        admin.is_master
                          ? "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-[#162E55] text-white"
                          : "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-[#EEF1F5] text-[#6B7590]"
                      }
                    >
                      {admin.is_master ? (
                        <><Shield className="h-2.5 w-2.5" strokeWidth={2} /> Master</>
                      ) : (
                        <><UserRound className="h-2.5 w-2.5" strokeWidth={2} /> Admin</>
                      )}
                    </span>
                  </div>
                  {!admin.is_master && (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => openResetFor(admin)}
                        title="Reset password"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1C2E5A1A] text-[#6B7590] transition-colors hover:border-[#162E55] hover:text-[#162E55]"
                      >
                        <KeyRound className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleRemove(admin)}
                        title="Remove admin"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1C2E5A1A] text-[#6B7590] transition-colors hover:border-red-300 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {activePanel === "create" && (
          <section className="rounded-2xl border border-[#1C2E5A1A] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-chillax font-semibold text-[#0E1726]">Create New Admin</h2>
                <p className="mt-0.5 text-xs text-[#6B7590]">
                  The new admin will be prompted to change their password on first use.
                </p>
              </div>
              <button
                onClick={closePanel}
                className="text-xs font-medium text-[#6B7590] hover:text-[#0E1726]"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              {createMsg && (
                <p
                  className={
                    createMsg.isError
                      ? "rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700"
                      : "rounded-xl bg-green-50 px-4 py-2.5 text-sm text-green-700"
                  }
                >
                  {createMsg.text}
                </p>
              )}
              <input
                type="text"
                placeholder="Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                className="w-full rounded-xl border border-[#1C2E5A1A] bg-[#F4F5F7] px-4 py-2.5 text-sm text-[#0E1726] placeholder:text-[#6B7590] focus:outline-none focus:ring-2 focus:ring-[#162E55]/30"
              />
              <div className="relative">
                <KeyRound
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7590]"
                  strokeWidth={1.5}
                />
                <input
                  type="password"
                  placeholder="Temporary password (min. 8 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#1C2E5A1A] bg-[#F4F5F7] py-2.5 pl-10 pr-4 text-sm text-[#0E1726] placeholder:text-[#6B7590] focus:outline-none focus:ring-2 focus:ring-[#162E55]/30"
                />
              </div>
              <button
                type="submit"
                disabled={creating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#162E55] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                {creating ? "Creating..." : "Create admin account"}
              </button>
            </form>
          </section>
        )}

        {activePanel === "reset" && resetTarget && (
          <section className="rounded-2xl border border-[#1C2E5A1A] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-chillax font-semibold text-[#0E1726]">
                  Reset Password — {resetTarget.username}
                </h2>
                <p className="mt-0.5 text-xs text-[#6B7590]">
                  Set a new temporary password for this account.
                </p>
              </div>
              <button
                onClick={closePanel}
                className="text-xs font-medium text-[#6B7590] hover:text-[#0E1726]"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-3">
              {resetMsg && (
                <p
                  className={
                    resetMsg.isError
                      ? "rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700"
                      : "rounded-xl bg-green-50 px-4 py-2.5 text-sm text-green-700"
                  }
                >
                  {resetMsg.text}
                </p>
              )}
              <div className="relative">
                <KeyRound
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7590]"
                  strokeWidth={1.5}
                />
                <input
                  type="password"
                  placeholder="New password (min. 8 characters)"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#1C2E5A1A] bg-[#F4F5F7] py-2.5 pl-10 pr-4 text-sm text-[#0E1726] placeholder:text-[#6B7590] focus:outline-none focus:ring-2 focus:ring-[#162E55]/30"
                />
              </div>
              <button
                type="submit"
                disabled={resetting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#162E55] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                <RefreshCw className="h-4 w-4" strokeWidth={2} />
                {resetting ? "Resetting..." : "Reset password"}
              </button>
            </form>
          </section>
        )}

      </div>
    </main>
  );
}

