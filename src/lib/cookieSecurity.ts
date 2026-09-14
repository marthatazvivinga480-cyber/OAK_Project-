import crypto from "crypto";

const FALLBACK_SESSION_SECRET = "oak-partner-convening-dev-session-secret";

function getSessionSecret(): string {
  const configuredSecret = process.env.SESSION_SECRET;

  if (configuredSecret && configuredSecret.trim().length > 0) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is required in production. Set it in the environment before starting the app.");
  }

  return FALLBACK_SESSION_SECRET;
}

export function signCookieValue(value: string): string {
  const hmac = crypto.createHmac("sha256", getSessionSecret());
  hmac.update(value);
  return `${value}.${hmac.digest("hex")}`;
}

export function verifyCookieValue(signedValue: string): string | null {
  if (!signedValue || typeof signedValue !== "string") return null;
  const parts = signedValue.split(".");
  if (parts.length !== 2) return null;

  const [value, signature] = parts;
  const expectedHmac = crypto.createHmac("sha256", getSessionSecret()).update(value).digest("hex");

  try {
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedHmac, "hex")
    );
    return isValid ? value : null;
  } catch {
    return null;
  }
}

