export type Role =
  | "Partner"
  | "OAK Staff"
  | "Coordination Team"
  | "Presenter"
  | "Observer";

export interface Participant {
  id: string;
  registration_id: string;
  first_name: string;
  last_name: string;
  organization: string;
  sub_partner_program_area: string | null;
  role: Role;
  email: string;
  phone: string | null;
  dietary_requirements: string | null;
  accessibility_requirements: string | null;
  travel_requirements: string | null;
  accommodation_requirements: string | null;
  registration_status: string;
  registration_date: string;
  qr_code_id: string | null;
  created_at: string;
}

export interface CheckIn {
  id: string;
  participant_id: string;
  check_in_date: string;
  check_in_time: string;
  attendance_status: string;
  checked_in_by: string | null;
}

export interface EventSession {
  id: string;
  day: string;
  start_time: string;
  end_time: string | null;
  title: string;
  speaker: string | null;
  venue: string | null;
  description: string | null;
}

export interface SessionNote {
  id: string;
  session_id: string;
  participant_id: string;
  note_text: string;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  areas_of_work: string | null;
  contact_name: string | null;
  contact_email: string | null;
}

export const PAGE_ACCESS: Record<string, Role[]> = {
  "/qr-code": ["Partner"],
  "/programme": ["OAK Staff", "Presenter", "Observer", "Coordination Team"],
  "/partners": ["OAK Staff", "Partner", "Presenter", "Observer", "Coordination Team"],
  "/checkin": ["Coordination Team"],
  "/attendance": ["Coordination Team"],
};