"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ScanLine, UsersRound } from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function Attendance() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/attendance")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = data?.stats || { total_registered: 0, total_checked_in: 0 };
  const participants = data?.participants || [];

  return (
    <div className="flex min-h-[941px] bg-[#F4F5F7]">
      <Sidebar />
      <main className="min-h-[941px] min-w-0 flex-1 bg-[#F4F5F7]">
        <div className="mx-auto w-full max-w-[672px] px-[32px] pt-[40px]">
          <header className="h-[54px] w-full">
            <h1 className="font-chillax text-[24px] font-bold text-[#0E1726]">Attendance</h1>
            <p className="font-inter text-[14px] text-[#6B7590]">Check-in tracking · 9–11 March 2026</p>
          </header>

          <div className="mt-[24px] grid grid-cols-3 gap-[12px]">
            <OverviewCard value={stats.total_registered.toString()} label="Expected" color="text-[#0E1726]" />
            <OverviewCard value={stats.total_checked_in.toString()} label="Checked In" color="text-[#1C2E5A]" />
            <OverviewCard value={(stats.total_registered - stats.total_checked_in).toString()} label="Pending" color="text-[#6B7590]" />
          </div>

          <div className="mt-6 w-full rounded-[24px] border border-[#1C2E5A1A] bg-white p-6 shadow-sm">
            {loading ? (
              <div className="py-20 text-center text-[#6B7590]">Loading attendance data...</div>
            ) : participants.length === 0 ? (
              <div className="flex flex-col items-center py-10">
                <UsersRound className="h-12 w-12 text-[#A8BBCE] mb-4" />
                <h2 className="font-chillax text-lg font-bold text-[#0E1726]">No check-ins yet</h2>
                <Link href="/checkin" className="mt-6 flex items-center gap-2 rounded-xl bg-[#162E55] px-6 py-3 text-white">
                  <ScanLine className="w-5 h-5" /> Go to Check-In
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {participants.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-[#F4F5F7] rounded-xl">
                    <div>
                      <p className="font-semibold text-[#0E1726]">{p.full_name}</p>
                      <p className="text-sm text-[#6B7590]">{p.organization} • {p.role}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.attendance_status === 'checked_in' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                        {p.attendance_status === 'checked_in' ? 'Present' : 'Pending'}
                      </span>
                      {p.check_in_time && <p className="text-xs text-[#6B7590] mt-1">{new Date(p.check_in_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function OverviewCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="flex h-[73px] flex-col items-center justify-center rounded-[16px] bg-[#EEF1F5] p-[12px]">
      <p className={`font-chillax text-[24px] font-bold ${color}`}>{value}</p>
      <p className="font-inter text-[10px] text-[#6B7590] mt-1">{label}</p>
    </div>
  );
}