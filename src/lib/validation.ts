import { z } from 'zod';
export const roles = ['Partner', 'OAK Staff', 'Coordination Team', 'Presenter', 'Observer'] as const;
const short = z.string().trim().min(1).max(160);
const optionalText = z.string().trim().max(500).nullish().transform(v => v || null);
export const registrationSchema = z.object({
  first_name: short, last_name: short, organization: short,
  role: z.enum(roles), email: z.string().trim().max(254).pipe(z.email()).transform(v => v.toLowerCase()),
  phone: z.string().trim().min(1).max(40),
  sub_partner_program_area: optionalText, dietary_requirements: optionalText,
  accessibility_requirements: optionalText, travel_requirements: optionalText,
  accommodation_requirements: optionalText, consent: z.literal(true),
  staff_access_code: z.string().max(200).optional(),
});
export const password = z.string().min(12, 'Use at least 12 characters').max(72).refine(v => Buffer.byteLength(v, 'utf8') <= 72, 'Password must be at most 72 UTF-8 bytes');
export const username = z.string().trim().min(3).max(80).regex(/^[a-zA-Z0-9_.@-]+$/);
export const loginSchema = z.object({ username, password: z.string().min(1).max(200) });
export const adminSchema = z.object({ username, password });
export const resetSchema = z.object({ id: z.uuid(), new_password: password });
export const changeSchema = z.object({ current_password: z.string().min(1).max(200), new_password: password });
export const idSchema = z.object({ id: z.uuid() });
export const noteSchema = z.object({ session_id: z.uuid(), note_text: z.string().trim().min(5).max(3000) });
export const recoverySchema = z.object({ registration_id: z.string().trim().toUpperCase().min(1).max(100), recovery_code: z.string().trim().regex(/^[a-f0-9]{64}$/) });
export const codeSchema = z.object({ qr_code_id: z.string().trim().toUpperCase().regex(/^OAK-2026-[A-Z0-9-]{8,64}$/) });
