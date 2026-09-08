"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/types";

const ROLES: Role[] = [
    "Partner",
    "OAK Staff",
    "Coordination Team",
    "Presenter",
    "Observer",
];

export default function RegistrationForm() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        const form = new FormData(event.currentTarget);
        const payload = {
            first_name: form.get("first_name"),
            last_name: form.get("last_name"),
            organization: form.get("organization"),
            sub_partner_program_area: form.get("sub_partner_program_area") || null,
            role: form.get("role"),
            email: form.get("email"),
            phone: form.get("phone") || null,
            dietary_requirements: form.get("dietary_requirements") || null,
            accessibility_requirements: form.get("accessibility_requirements") || null,
            travel_requirements: form.get("travel_requirements") || null,
            accommodation_requirements: form.get("accommodation_requirements") || null,
        };

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const body = await res.json();
                throw new Error(body.error || "Registration failed");
            }

            const { role, registration_id } = await res.json();

            if (role === "Partner") {
                router.push(`/qr-code?id=${registration_id}`);
            } else if (role === "Coordination Team") {
                router.push("/checkin");
            } else {
                router.push("/programme");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
            {error && (
                <p className="bg-red-50 text-red-600 text-sm rounded-md px-4 py-3">
                    {error}
                </p>
            )}

            <fieldset className="space-y-4">
                <legend className="font-medium mb-1">Personal information</legend>
                <div className="grid grid-cols-2 gap-4">
                    <input name="first_name" placeholder="First name" required className="border rounded-md px-3 py-2" />
                    <input name="last_name" placeholder="Last name" required className="border rounded-md px-3 py-2" />
                </div>
                <input name="organization" placeholder="Organization" required className="border rounded-md px-3 py-2 w-full" />
                <input name="sub_partner_program_area" placeholder="Sub-partner / programme area (optional)" className="border rounded-md px-3 py-2 w-full" />
            </fieldset>

            <fieldset>
                <legend className="font-medium mb-1">Role</legend>
                <select name="role" required defaultValue="" className="border rounded-md px-3 py-2 w-full bg-white">
                    <option value="" disabled>Select your role</option>
                    {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
            </fieldset>

            <fieldset className="space-y-4">
                <legend className="font-medium mb-1">Contact information</legend>
                <input name="email" type="email" placeholder="you@organisation.org" required className="border rounded-md px-3 py-2 w-full" />
                <input name="phone" placeholder="Phone number" className="border rounded-md px-3 py-2 w-full" />
            </fieldset>

            <fieldset className="space-y-4">
                <legend className="font-medium mb-1">Additional requirements</legend>
                <input name="dietary_requirements" placeholder="Dietary requirements" className="border rounded-md px-3 py-2 w-full" />
                <input name="accessibility_requirements" placeholder="Accessibility requirements" className="border rounded-md px-3 py-2 w-full" />
                <input name="travel_requirements" placeholder="Travel requirements" className="border rounded-md px-3 py-2 w-full" />
                <input name="accommodation_requirements" placeholder="Accommodation requirements" className="border rounded-md px-3 py-2 w-full" />
            </fieldset>

            <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-6 py-3 rounded-md w-full">
                {submitting ? "Registering…" : "Register"}
            </button>
        </form>
    );
}