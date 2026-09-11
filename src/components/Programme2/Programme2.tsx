
"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  FileText,
  Image as ImageIcon,
  Lightbulb,
  Paperclip,
  Plus,
  Download,
  ArrowUpRight,
  StickyNote,
} from "lucide-react";

type SessionNote = {
  initials: string;
  name: string;
  organisation: string;
  time: string;
  note: string;
};

const sessionNotes: SessionNote[] = [
  {
    initials: "MS",
    name: "Maria Schmidt",
    organisation: "Open Society Foundations",
    time: "Day 1 · 14:32",
    note: "The rights-based approaches session surfaced strong demand for a shared learn...",
  },
  {
    initials: "JO",
    name: "James Odhiambo",
    organisation: "OAK Foundation",
    time: "Day 1 · 16:50",
    note: "Digital Rights breakout: participants want a working group to share tools for operating in restricted digital environments. Interested orgs: Digital Frontiers, Access Now, EFF.",
  },
  {
    initials: "AD",
    name: "Awa Diallo",
    organisation: "Geneva Secretariat",
    time: "Day 2 · 11:15",
    note: "Strategic communications workshop highly rated. Rashida's adaptive messaging framework is directly applicable across 60% of the portfolio. Requesting follow-up toolkit.",
  },
  {
    initials: "PAD",
    name: "Prof. Amara Diallo",
    organisation: "Sciences Po Paris",
    time: "Day 2 · 16:00",
    note: "Fishbowl revealed consensus: philanthropy needs to accept longer time horizons (10+ years) and better share learning. Key ask: OAK to publish failure cases alongside success stories.",
  },
];

const takeaways = [
  "Philanthropy needs to accept 10+ year time horizons for systemic change",
  "Shared learning infrastructure is the most requested resource across the portfolio",
  "Digital rights must be integrated into all programme areas, not siloed",
  "Rights-based framing significantly improves grantee advocacy effectiveness",
  "Peer exchange is rated more valuable than expert-led sessions (92% vs 74%)",
];

const resources = [
  {
    title: "Opening Plenary Presentation",
    meta: "PDF · 3.2 MB · Day 1",
  },
  {
    title: "OAK Portfolio Overview 2024–26",
    meta: "PDF · 1.8 MB · Day 2",
  },
  {
    title: "Action Planning Workbook",
    meta: "DOCX · 0.9 MB · Day 3",
  },
  {
    title: "Partner Contact Directory",
    meta: "XLSX · 0.4 MB · All Days",
  },
  {
    title: "Photo Gallery (High Res)",
    meta: "ZIP · 184 MB · All Days",
  },
];

const gallery = [
  {
    title: "Opening plenary session",
    src: "/programme/opening-plenary.jpg",
  },
  {
    title: "Partner discussion",
    src: "/programme/partner-discussion.jpg",
  },
  {
    title: "Workshop session",
    src: "/programme/workshop-session.jpg",
  },
  {
    title: "Networking session",
    src: "/programme/networking.jpg",
  },
  {
    title: "Group discussion",
    src: "/programme/group-discussion.jpg",
  },
  {
    title: "Closing session",
    src: "/programme/closing-session.jpg",
  },
];

export default function ProgrammePage() {
  const [activeTab, setActiveTab] = useState<"Schedule" | "Docs">("Docs");
  const [notes, setNotes] = useState(sessionNotes);

  const addNote = () => {
    const newNote: SessionNote = {
      initials: "YO",
      name: "You",
      organisation: "OAK Foundation",
      time: "Just now",
      note: "New session note added.",
    };

    setNotes((current) => [newNote, ...current]);
  };

  return (
    <main className="min-h-screen w-full bg-[var(--oak-page)]">
      <div className="mx-auto flex w-full max-w-[672px] flex-col gap-[13px] px-8 py-10">
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}
        <header className="w-full">
          <h1 className="font-chillax text-[24px] font-bold leading-8 text-[var(--oak-text)]">
            Programme
          </h1>

          <p className="pt-0.5 font-inter text-[14px] leading-5 text-[var(--oak-muted)]">
            OAK Partner Convening 2026
          </p>
        </header>

        {/* =====================================================
            TABS
        ===================================================== */}
        <div className="flex w-full items-center justify-between rounded-[7px] bg-[#E5E8EE] p-1">
          <button
            type="button"
            onClick={() => setActiveTab("Schedule")}
            className={[
              "flex flex-1 items-center justify-center rounded-[12px] px-[14px] py-2",
              "font-inter text-[12px] capitalize leading-4",
              activeTab === "Schedule"
                ? "bg-white text-[var(--oak-text)] shadow-[0_1px_4px_0_#00000014]"
                : "text-[var(--oak-muted)]",
            ].join(" ")}
          >
            Schedule
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("Docs")}
            className={[
              "flex flex-1 items-center justify-center rounded-[12px] px-[14px] py-2",
              "font-inter text-[12px] capitalize leading-4",
              activeTab === "Docs"
                ? "bg-white text-[var(--oak-text)] shadow-[0_1px_4px_0_#00000014]"
                : "text-[var(--oak-muted)]",
            ].join(" ")}
          >
            Docs
          </button>
        </div>

        {/* =====================================================
            SCHEDULE VIEW
        ===================================================== */}
        {activeTab === "Schedule" && (
          <section className="rounded-[24px] border border-[#1C2E5A1A] bg-white p-5 shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <div className="flex items-center gap-2">
              <CalendarDays
                size={17}
                strokeWidth={1.8}
                className="text-[var(--oak-navy)]"
              />

              <h2 className="font-chillax text-[18px] font-semibold leading-7 text-[var(--oak-text)]">
                Programme Schedule
              </h2>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {[
                ["Day 1", "Opening Plenary", "09:00"],
                ["Day 1", "Rights-Based Approaches", "14:00"],
                ["Day 2", "Strategic Communications", "11:00"],
                ["Day 2", "Fishbowl Discussion", "16:00"],
                ["Day 3", "Action Planning", "10:00"],
              ].map(([day, title, time]) => (
                <div
                  key={`${day}-${title}`}
                  className="rounded-[16px] bg-[var(--oak-input)] p-4"
                >
                  <p className="font-inter text-[10px] font-bold uppercase tracking-[1px] text-[var(--oak-muted)]">
                    {day} · {time}
                  </p>

                  <p className="pt-1 font-inter text-[14px] font-bold text-[var(--oak-text)]">
                    {title}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =====================================================
            SESSION NOTES
        ===================================================== */}
        {activeTab === "Docs" && (
          <>
            <section className="w-full pt-[3px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StickyNote
                    size={17}
                    strokeWidth={1.8}
                    className="text-[var(--oak-navy)]"
                  />

                  <h2 className="font-chillax text-[18px] font-semibold leading-7 text-[var(--oak-text)]">
                    Session Notes
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={addNote}
                  className="flex items-center gap-1.5 rounded-[12px] bg-[var(--oak-navy)] px-[14px] py-2 font-chillax text-[12px] font-semibold leading-4 text-white shadow-[0_4px_20px_0_#1C2E5A4D]"
                >
                  <Plus size={14} strokeWidth={2} />
                  Add Note
                </button>
              </div>

              <div className="flex w-full flex-col gap-3 pt-3">
                {notes.map((note, index) => (
                  <article
                    key={`${note.initials}-${index}`}
                    className="w-full rounded-[24px] border border-[#1C2E5A1A] bg-white p-4 shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[12px] bg-[var(--oak-navy)]">
                          <span className="font-inter text-[10px] font-bold leading-[15px] text-white">
                            {note.initials}
                          </span>
                        </div>

                        <div>
                          <p className="font-inter text-[12px] font-bold leading-4 text-[var(--oak-text)]">
                            {note.name}
                          </p>

                          <p className="font-inter text-[10px] leading-[15px] text-[var(--oak-muted)]">
                            {note.organisation}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-[8px] bg-[var(--oak-input)] px-2 py-1 font-inter text-[10px] leading-[15px] text-[var(--oak-muted)]">
                        {note.time}
                      </span>
                    </div>

                    <p className="pt-[10px] font-inter text-[14px] leading-[23px] text-[var(--oak-text)]">
                      {note.note}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* =================================================
                PHOTO GALLERY
            ================================================= */}
            <section className="w-full pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon
                    size={17}
                    strokeWidth={1.8}
                    className="text-[var(--oak-navy)]"
                  />

                  <h2 className="font-chillax text-[18px] font-semibold leading-7 text-[var(--oak-text)]">
                    Photo Gallery
                  </h2>
                </div>

                <span className="rounded-[8px] bg-[var(--oak-input)] px-[10px] py-1 font-inter text-[12px] leading-4 text-[var(--oak-muted)]">
                  6 photos
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                {gallery.map((photo) => (
                  <button
                    key={photo.title}
                    type="button"
                    className="group relative h-[224px] overflow-hidden rounded-2xl bg-[#E5E8EE]"
                  >
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-10">
                      <p className="text-left font-inter text-[11px] font-bold text-white">
                        {photo.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* =================================================
                KEY TAKEAWAYS
            ================================================= */}
            <section className="w-full pt-6">
              <div className="flex items-center gap-2">
                <Lightbulb
                  size={17}
                  strokeWidth={1.8}
                  className="text-[var(--oak-navy)]"
                />

                <h2 className="font-chillax text-[18px] font-semibold leading-7 text-[var(--oak-text)]">
                  Key Takeaways
                </h2>
              </div>

              <div className="mt-3 rounded-[24px] border border-[#1C2E5A1A] bg-white p-5 shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
                {takeaways.map((takeaway, index) => (
                  <div
                    key={takeaway}
                    className={[
                      "flex gap-3",
                      index > 0 ? "pt-[14px]" : "",
                    ].join(" ")}
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--oak-navy)]">
                      <span className="font-inter text-[9px] font-bold leading-[14px] text-white">
                        {index + 1}
                      </span>
                    </div>

                    <p className="font-inter text-[14px] leading-[23px] text-[var(--oak-text)]">
                      {takeaway}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* =================================================
                RESOURCES
            ================================================= */}
            <section className="w-full pt-6">
              <div className="flex items-center gap-2">
                <Paperclip
                  size={17}
                  strokeWidth={1.8}
                  className="text-[var(--oak-navy)]"
                />

                <h2 className="font-chillax text-[18px] font-semibold leading-7 text-[var(--oak-text)]">
                  Resources
                </h2>
              </div>

              <div className="flex w-full flex-col gap-3 pt-3">
                {resources.map((resource) => (
                  <button
                    key={resource.title}
                    type="button"
                    className="flex w-full items-center gap-[14px] rounded-[24px] border border-[#1C2E5A1A] bg-white p-4 text-left shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--oak-input)]">
                      <FileText
                        size={19}
                        strokeWidth={1.8}
                        className="text-[var(--oak-navy)]"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-inter text-[14px] font-medium leading-5 text-[var(--oak-text)]">
                        {resource.title}
                      </p>

                      <p className="pt-0.5 font-inter text-[12px] leading-4 text-[var(--oak-muted)]">
                        {resource.meta}
                      </p>
                    </div>

                    <Download
                      size={15}
                      strokeWidth={2}
                      className="shrink-0 text-[var(--oak-muted)]"
                    />
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
