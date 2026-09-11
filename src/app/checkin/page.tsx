"use client";

import { useEffect, useState } from "react";
import EventCheckIn from "@/components/EventCheckIn/EventCheckIn";
import CheckInSuccessPage from "@/components/Checkin/Checkin";
import CheckInErrorPage from "@/components/CheckedInFailed/CheckedInFailed";

interface EventSession {
  id: string;
  day: string;
  start_time: string;
  title: string;
  venue: string | null;
}

type View =
  | { status: "idle" }
  | {
      status: "success";
      participant: { first_name: string; last_name: string; organization: string; role: string };
      check_in_time: string;
      live_stats: { total_registered: number; total_checked_in: number };
    }
  | { status: "error"; title: string; description: string };

export default function CheckInPage() {
  const [view, setView] = useState<View>({ status: "idle" });
  const [nextSession, setNextSession] = useState<{ title: string; venue: string } | null>(null);
  const [recentScans, setRecentScans] = useState<
    {
      initials: string;
      name: string;
      code: string;
      role: "Partner" | "OAK Staff" | "Coordination Team" | "Presenter" | "Observer";
    }[]
  >([]);

  // Find the next upcoming session, once, from real data.
  useEffect(() => {
    fetch("/api/sessions")
      .then((res) => res.json())
      .then((sessions: EventSession[]) => {
        const now = new Date();
        const upcoming = sessions
          .map((s) => ({ ...s, startDateTime: new Date(`${s.day}T${s.start_time}`) }))
          .filter((s) => s.startDateTime > now)
          .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())[0];
        if (upcoming) {
          setNextSession({ title: upcoming.title, venue: upcoming.venue ?? "TBA" });
        }
      })
      .catch(() => {});
  }, []);

  async function handleScan(code: string) {
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr_code_id: code }),
      });
      const body = await res.json();

      if (!res.ok) {
        // Map our real API error strings to a title + description pair,
        // instead of always showing "QR Not Recognised".
        const errorMap: Record<string, { title: string; description: string }> = {
          "Participant Not Found": { title: "QR Not Recognised", description: "Code is invalid or unregistered" },
          "Duplicate QR Code — already checked in today": { title: "Already Checked In", description: "This attendee has already been checked in today" },
          "QR Code Expired": { title: "QR Code Expired", description: "This code is no longer valid" },
        };
        const match = errorMap[body.error] ?? { title: "Check-In Failed", description: body.error || "Something went wrong" };
        setView({ status: "error", ...match });
        return;
      }

      setView({ status: "success", ...body });
      setRecentScans((prev) => [
        {
          initials: `${body.participant.first_name[0]}${body.participant.last_name[0]}`,
          name: `${body.participant.first_name} ${body.participant.last_name}`,
          code,
          role: body.participant.role,
        },
        ...prev,
      ].slice(0, 5)); // keep only the 5 most recent
    } catch {
      setView({ status: "error", title: "Network Error", description: "Could not reach the server. Check your connection and try again." });
    }
  }

  function resetToIdle() {
    setView({ status: "idle" });
  }

  if (view.status === "success") {
    return (
      <CheckInSuccessPage
        participant={view.participant}
        check_in_time={view.check_in_time}
        next_session={nextSession}
        live_stats={view.live_stats}
      />
    );
  }

  if (view.status === "error") {
    return (
      <CheckInErrorPage
        title={view.title}
        description={view.description}
        onRetry={resetToIdle}
      />
    );
  }

  return <EventCheckIn onScan={handleScan} recentScans={recentScans} />;
}