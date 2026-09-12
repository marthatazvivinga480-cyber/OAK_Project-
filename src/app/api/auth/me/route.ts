import { NextResponse } from "next/server";
import { getCurrentParticipant, getCurrentAdmin } from "@/lib/session";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (admin) {
    return NextResponse.json({
      user: {
        id: admin.id,
        name: admin.username,
        role: "Admin",
        isAdmin: true,
      }
    });
  }

  const participant = await getCurrentParticipant();
  if (participant) {
    return NextResponse.json({
      user: {
        id: participant.id,
        name: `${participant.first_name} ${participant.last_name}`,
        role: participant.role,
        isAdmin: false,
      }
    });
  }

  return NextResponse.json({ user: null }, { status: 401 });
}
