export type RegistrationDetails = {
  registration_id: string;
  first_name: string;
  last_name: string;
  organization: string;
  role: string;
  email: string;
  phone?: string | null;
  event_dates: string;
  location: string;
};



export async function getRegistrationById(
  registrationId: string
): Promise<RegistrationDetails> {
  /*
    PLACEHOLDER DATA FOR NOW

    Later, replace this object with a real fetch such as:

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/registrations/${registrationId}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Registration not found");
    }

    return res.json();
  */

  return {
    registration_id: registrationId,
    first_name: "tinashe",
    last_name: "smith",
    organization: "uncommon.org",
    role: "Partner",
    email: "tinasheuncommon.org",
    phone: null,
    event_dates: "9–11 March 2026",
    location: "Harare, Zimbabwe",
  };
}