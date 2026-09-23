"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ScanLine,
  CalendarDays,
  Globe,
  Grid2X2,
  Shield,
  UserRound,
  KeyRound,
  LogOut,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

interface AdminInfo {
  id: string;
  username: string;
  is_master: boolean;
}

const BASE_PERMISSIONS = [
  {
    icon: ScanLine,
    label: "Check-In Scanner",
    href: "/checkin",
    description: "Scan partner QR codes at the venue entrance",
  },
  {
    icon: Grid2X2,
    label: "Attendance Dashboard",
    href: "/attendance",
    description: "View real-time attendance counts and role breakdown",
  },
  {
    icon: CalendarDays,
    label: "Programme",
    href: "/programme",
    description: "Browse event sessions and take notes",
  },
  {
    icon: Globe,
    label: "Partners Directory",
    href: "/partners",
    description: "View partner organisations and contacts",
  },
];

export default function AccountPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMessage, setPwMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setAdmin(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && !admin) {
      router.replace("/admin-login");
    }
  }, [admin, loading, router]);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMessage(null);
    if (newPassword !== confirmPassword) {
      setPwMessage({ text: "New passwords do not match", isError: true });
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
      setPwMessage({ text: body.error, isError: true });
      return;
    }
    setPwMessage({ text: "Password changed successfully", isError: false });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  async function handleSignOut() {
    setSigningOut(true);
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.push("/admin-login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F5F7]">
        <p className="text-sm text-[#6B7590]">Loading...</p>
      </main>
    );
  }

  if (!admin) {
    return null;
  }

  const initial = admin.username.charAt(0).toUpperCase();

  const allPermissions = [
    ...BASE_PERMISSIONS,
    ...(admin.is_master
      ? [
          {
            icon: Shield,
            label: "Manage Admin Accounts",
            href: "/account/manage-admins",
            description: "Create and remove coordination team accounts — master only",
          },
        ]
      : []),
  ];

  return (
    <main className="min-h-screen bg-[#F4F5F7] px-4 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-2xl space-y-6">

        <section className="rounded-2xl border border-[#1C2E5A1A] bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#162E55] text-xl font-semibold text-white font-chillax">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#0E1726] font-semibold text-lg leading-tight truncate font-chillax">
                {admin.username}
              </p>
              <div className="mt-1">
                <span
                  className={
                    admin.is_master
                      ? "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[#162E55] text-white"
                      : "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[#EEF1F5] text-[#6B7590]"
                  }
                >
                  {admin.is_master ? (
                    <>
                      <Shield className="h-3 w-3" strokeWidth={2} />
                      Master Admin
                    </>
                  ) : (
                    <>
                      <UserRound className="h-3 w-3" strokeWidth={2} />
                      Admin
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#6B7590]">
            Session valid for 8 hours from sign-in. All actions performed under this account are
            logged.
          </p>
        </section>

        {admin.is_master && (
          <Link
            href="/account/manage-admins"
            className="group flex items-center justify-between rounded-2xl border border-[#162E55]/20 bg-[#162E55] px-6 py-5 text-white transition-opacity hover:opacity-90"
          >
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="font-semibold text-sm">Manage Admin Accounts</p>
                <p className="text-xs text-white/70 mt-0.5">
                  Create, reset passwords, and remove coordination team accounts
                </p>
              </div>
            </div>
            <ChevronRight
              className="h-5 w-5 shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
              strokeWidth={1.5}
            />
          </Link>
        )}

        <section className="rounded-2xl border border-[#1C2E5A1A] bg-white p-6">
          <h2 className="mb-4 font-chillax font-semibold text-[#0E1726]">Account Permissions</h2>
          <ul className="space-y-3">
            {allPermissions.map(({ label, href, description }) => (
              <li key={href} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#162E55]"
                  strokeWidth={2}
                />
                <div className="flex-1 min-w-0">
                  <Link
                    href={href}
                    className="text-sm font-semibold text-[#0E1726] transition-colors hover:text-[#162E55]"
                  >
                    {label}
                  </Link>
                  <p className="mt-0.5 text-xs text-[#6B7590]">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#1C2E5A1A] bg-white p-6">
          <h2 className="mb-1 font-chillax font-semibold text-[#0E1726]">Security</h2>
          <p className="mb-5 text-xs text-[#6B7590]">
            Change your password. Minimum 8 characters.
          </p>

          <form onSubmit={handleChangePassword} className="space-y-3">
            {pwMessage && (
              <p
                className={
                  pwMessage.isError
                    ? "rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700"
                    : "rounded-xl bg-green-50 px-4 py-2.5 text-sm text-green-700"
                }
              >
                {pwMessage.text}
              </p>
            )}
            <div className="relative">
              <KeyRound
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7590]"
                strokeWidth={1.5}
              />
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-[#1C2E5A1A] bg-[#F4F5F7] py-2.5 pl-10 pr-4 text-sm text-[#0E1726] placeholder:text-[#6B7590] focus:outline-none focus:ring-2 focus:ring-[#162E55]/30"
              />
            </div>
            <div className="relative">
              <KeyRound
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7590]"
                strokeWidth={1.5}
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-[#1C2E5A1A] bg-[#F4F5F7] py-2.5 pl-10 pr-4 text-sm text-[#0E1726] placeholder:text-[#6B7590] focus:outline-none focus:ring-2 focus:ring-[#162E55]/30"
              />
            </div>
            <div className="relative">
              <KeyRound
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7590]"
                strokeWidth={1.5}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-[#1C2E5A1A] bg-[#F4F5F7] py-2.5 pl-10 pr-4 text-sm text-[#0E1726] placeholder:text-[#6B7590] focus:outline-none focus:ring-2 focus:ring-[#162E55]/30"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#162E55] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Changing..." : "Change password"}
            </button>
          </form>

          <div className="mt-5 border-t border-[#1C2E5A1A] pt-5">
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#1C2E5A1A] py-2.5 text-sm font-semibold text-[#6B7590] transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}