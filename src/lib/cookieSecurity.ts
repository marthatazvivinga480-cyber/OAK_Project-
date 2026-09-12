import crypto from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET || "fallback-secret-for-dev-only-change-in-prod";

export function signCookieValue(value: string): string {
  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(value);
  return `${value}.${hmac.digest("hex")}`;
}

export function verifyCookieValue(signedValue: string): string | null {
  if (!signedValue || typeof signedValue !== "string") return null;
  const parts = signedValue.split(".");
  if (parts.length !== 2) return null;
  
  const [value, signature] = parts;
  const expectedHmac = crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
  
  try {
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedHmac, "hex")
    );
    return isValid ? value : null;
  } catch (e) {
    return null;
  }
}
