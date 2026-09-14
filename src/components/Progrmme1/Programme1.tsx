"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  MapPin,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";

type DayKey = "day1" | "day2" | "day3";

type SessionType =
  | "Plenary"
  | "Breakout"
  | "Workshop"
  | "Social";

type SessionCardProps = {
  start: string;
  end: string;
  title: string;
  person?: string;
  location: string;
  type: SessionType;
};

type SessionRecord = {
  id: string;
  day: string;
  start_time: string;
  end_time?: string | null;
  title: string;
  speaker?: string | null;
  venue?: string | null;
  description?: string | null;
};

export default function Programme() {
  const [selectedDay, setSelectedDay] = useState<DayKey>("day1");
  const [activeTab, setActiveTab] = useState<"schedule" | "docs">("schedule");
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [notes, setNotes] = useState<{ id: string; note_text: string; updated_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sessions")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load sessions");
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      })
      .then((data) => setSessions(data))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/notes")
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) return [];
          throw new Error("Failed to load notes");
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      })
      .then((data) => setNotes(data))
      .catch(() => setNotes([]))
      .finally(() => setNotesLoading(false));
  }, []);

  const dayMap: Record<DayKey, string> = {
    day1: "Day 1",
    day2: "Day 2",
    day3: "Day 3",
  };

  const currentDayLabel = dayMap[selectedDay];
  const currentSessions = sessions.filter((session) => session.day === currentDayLabel);

  return (
    <div className="flex min-h-[1179px] bg-[#F4F5F7] pb-[80px] md:pb-0">
      <Sidebar />

      <main className="min-h-[1179px] min-w-0 flex-1 bg-[#F4F5F7]">
        <div className="mx-auto w-full max-w-[672px] px-[32px] py-[40px]">
          <div className="h-[54px] w-[195.234375px]">
            <h1 className="m-0 h-[32px] font-chillax text-[24px] font-bold leading-[32px] tracking-[0px] text-[#0E1726]">
              Programme
            </h1>

            <p className="m-0 h-[22px] pt-[2px] font-inter text-[14px] font-normal leading-[20px] tracking-[0px] text-[#6B7590]">
              OAK Partner Convening 2026
            </p>
          </div>

          <div className="mt-[16px] flex h-[40px] w-full max-w-[602px] items-center justify-between rounded-[7px] bg-[#E5E8EE] p-[4px]">
            <button
              type="button"
              onClick={() => setActiveTab("schedule")}
              className={`flex h-[32px] w-[140px] shrink-0 items-center justify-center rounded-[12px] px-[44px] py-[8px] text-[12px] font-semibold leading-[16px] ${
                activeTab === "schedule"
                  ? "bg-white text-[#0E1726] shadow-[0_1px_4px_0_#00000014]"
                  : "bg-transparent text-[#6B7590]"
              }`}
            >
              Schedule
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("docs")}
              className={`flex h-[32px] w-[56px] shrink-0 items-center justify-center rounded-[12px] px-[14px] py-[8px] text-[12px] font-semibold leading-[16px] ${
                activeTab === "docs"
                  ? "bg-white text-[#0E1726] shadow-[0_1px_4px_0_#00000014]"
                  : "bg-transparent text-[#6B7590]"
              }`}
            >
              Docs
            </button>
          </div>

          {activeTab === "schedule" ? (
            <>
              <div className="w-full pt-[15px]">
                <div className="grid h-[85px] w-full grid-cols-3 gap-[10px]">
                  <DayButton
                    active={selectedDay === "day1"}
                    weekday="Mon"
                    day="Day 1"
                    date="9 Mar"
                    onClick={() => setSelectedDay("day1")}
                  />

                  <DayButton
                    active={selectedDay === "day2"}
                    weekday="Tue"
                    day="Day 2"
                    date="10 Mar"
                    onClick={() => setSelectedDay("day2")}
                  />

                  <DayButton
                    active={selectedDay === "day3"}
                    weekday="Wed"
                    day="Day 3"
                    date="11 Mar"
                    onClick={() => setSelectedDay("day3")}
                  />
                </div>
              </div>

              {loading ? (
                <div className="mt-[20px] text-center text-[#6B7590]">Loading schedule...</div>
              ) : currentSessions.length > 0 ? (
                <>
                  <div className="flex h-[32.5px] w-full items-start gap-[12px] pt-[16px]">
                    <LegendItem label="Plenary" colour="#1C2E5A" />
                    <LegendItem label="Breakout" colour="#F59E0B" />
                    <LegendItem label="Workshop" colour="#8B5CF6" />
                    <LegendItem label="Social" colour="#F97316" />
                  </div>

                  {currentSessions.map((session, index) => {
                    const title = session.title.toLowerCase();
                    let type: SessionType = "Plenary";

                    if (title.includes("breakout")) type = "Breakout";
                    if (title.includes("workshop")) type = "Workshop";
                    if (title.includes("social") || title.includes("reception") || title.includes("dinner")) type = "Social";

                    if (title.includes("break") || title.includes("lunch") || title.includes("registration")) {
                      return (
                        <TimelineDivider
                          key={`${session.id}-${index}`}
                          time={session.start_time}
                          label={session.title}
                          compact={title.includes("registration")}
                        />
                      );
                    }

                    return (
                      <SessionCard
                        key={`${session.id}-${index}`}
                        start={session.start_time}
                        end={session.end_time || ""}
                        title={session.title}
                        person={session.speaker || undefined}
                        location={session.venue || "TBD"}
                        type={type}
                      />
                    );
                  })}
                </>
              ) : (
                <div className="mt-[20px] rounded-[24px] border border-[#1C2E5A1A] bg-white p-[24px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
                  <p className="m-0 font-inter text-[14px] font-normal leading-[20px] text-[#6B7590]">
                    No sessions are available for this day yet.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="mt-[20px] rounded-[24px] border border-[#1C2E5A1A] bg-white p-[24px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
              <p className="m-0 font-inter text-[14px] font-normal leading-[20px] text-[#6B7590]">
                {notesLoading ? "Loading notes..." : notes.length > 0 ? "Session notes are loaded from the live backend." : "No session notes have been submitted yet."}
              </p>

              {notes.length > 0 && (
                <div className="mt-4 flex flex-col gap-3">
                  {notes.map((note) => (
                    <div key={note.id} className="rounded-[20px] border border-[#1C2E5A1A] bg-[#F9FAFB] p-4">
                      <p className="font-inter text-[10px] uppercase tracking-[0.8px] text-[#6B7590]">
                        {new Date(note.updated_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                      <p className="mt-2 font-inter text-[14px] leading-[22px] text-[#0E1726]">
                        {note.note_text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function DayButton({ active, weekday, day, date, onClick }: { active: boolean; weekday: string; day: string; date: string; onClick: () => void; }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[85px] rounded-[24px] p-[14px] text-left ${
        active ? "bg-[#162E55] shadow-[0_4px_20px_0_#1C2E5A4D]" : "border border-[#1C2E5A1A] bg-white shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]"
      }`}
    >
      <p className={`m-0 h-[15px] font-inter text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] ${active ? "text-white/60" : "text-[#6B7590]"}`}>
        {weekday}
      </p>
      <p className={`m-0 h-[20px] pt-[2px] font-chillax text-[18px] font-bold leading-[18px] ${active ? "text-white" : "text-[#0E1726]"}`}>
        {day}
      </p>
      <p className={`m-0 h-[20px] pt-[4px] font-inter text-[12px] font-normal leading-[16px] ${active ? "text-white/60" : "text-[#6B7590]"}`}>
        {date}
      </p>
    </button>
  );
}

function LegendItem({ label, colour }: { label: string; colour: string; }) {
  return (
    <div className="flex h-[16.5px] items-center gap-[6px]">
      <span className="h-[8px] w-[8px] rounded-full" style={{ backgroundColor: colour }} />
      <span className="font-inter text-[11px] font-normal leading-[16.5px] text-[#6B7590]">{label}</span>
    </div>
  );
}

function TimelineDivider({ time, label, compact = false }: { time: string; label: string; compact?: boolean; }) {
  return (
    <div className={`flex w-full items-center gap-[12px] px-[4px] ${compact ? "h-[28px] py-[6px]" : "h-[36px] pb-[6px] pt-[14px]"}`}>
      <span className="w-[40px] shrink-0 font-mono text-[12px] font-normal leading-[16px] text-[#6B7590]">{time}</span>
      <div className="h-px flex-1 bg-[#1C2E5A1A]" />
      <span className="shrink-0 whitespace-nowrap font-inter text-[12px] font-normal leading-[16px] text-[#6B7590]">{label}</span>
      <div className="h-px flex-1 bg-[#1C2E5A1A]" />
    </div>
  );
}

function SessionCard({ start, end, title, person, location, type }: SessionCardProps) {
  const badgeStyles: Record<SessionType, string> = {
    Plenary: "border-[#C5CFDF] bg-[#EEF1F9] text-[#1C2E5A]",
    Breakout: "border-[#FDE68A] bg-[#FEF3C7] text-[#92400E]",
    Workshop: "border-[#DDD6FE] bg-[#F5F3FF] text-[#7C3AED]",
    Social: "border-[#FDBA74] bg-[#FFF7ED] text-[#C2410C]",
  };

  const dotStyles: Record<SessionType, string> = {
    Plenary: "bg-[#1C2E5A]",
    Breakout: "bg-[#F59E0B]",
    Workshop: "bg-[#8B5CF6]",
    Social: "bg-[#F97316]",
  };

  return (
    <div className="h-[111px] w-full pt-[8px]">
      <button type="button" className="h-[103px] w-full rounded-[24px] border border-[#1C2E5A1A] bg-white p-[16px] text-left shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
        <div className="flex h-[69px] w-full gap-[12px]">
          <div className="h-[33px] w-[56px] shrink-0 pt-[2px] text-right">
            <p className="m-0 h-[16px] font-mono text-[12px] font-bold leading-[16px] text-[#0E1726]">{start}</p>
            <p className="m-0 h-[15px] font-inter text-[10px] font-normal leading-[15px] text-[#6B7590]">–{end}</p>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex h-[27px] w-full items-start justify-between gap-[8px]">
              <p className="m-0 min-w-0 flex-1 truncate font-inter text-[14px] font-semibold leading-[19.25px] text-[#0E1726]">{title}</p>

              <div className={`flex h-[27px] shrink-0 items-center justify-center gap-[4px] rounded-full border px-[10px] py-[4px] ${badgeStyles[type]}`}>
                <span className={`h-[6px] w-[6px] rounded-full ${dotStyles[type]}`} />
                <span className="whitespace-nowrap font-inter text-[11px] font-semibold leading-[16.5px] tracking-[0.22px]">{type}</span>
              </div>
            </div>

            {person ? (
              <p className="m-0 h-[22px] w-full truncate pt-[6px] font-inter text-[12px] font-normal leading-[16px] text-[#6B7590]">{person}</p>
            ) : (
              <div className="h-[22px]" />
            )}

            <div className="flex h-[20px] w-full items-center gap-[4px] pt-[4px]">
              <MapPin className="h-[10px] w-[10px] shrink-0 text-[#6B7590]" strokeWidth={1.2} />
              <span className="truncate font-inter text-[12px] font-normal leading-[16px] text-[#6B7590]">{location}</span>
              <ChevronDown className="ml-auto h-[14px] w-[14px] shrink-0 text-[#6B7590]" strokeWidth={1.2} />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}