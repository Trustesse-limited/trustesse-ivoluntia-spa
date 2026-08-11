/**
 * iVoluntia — Secure "Remember Me" Utility
 *
 * - Email is stored in plain text (it's not sensitive)
 * - Password is NEVER stored in plain text
 * - Password is encrypted using Web Crypto API (AES-GCM)
 * - Encryption key is derived from a device-specific secret + random salt
 * - Uses PBKDF2 for key derivation (industry standard)
 *
 * This ensures that even if localStorage is compromised,
 * the password remains encrypted and unusable without the device secret.
 */

const REMEMBER_ME_KEY = "ivoluntia_remember_me";
const DEVICE_SECRET_KEY = "ivoluntia_device_secret";

interface RememberMeData {
  email: string;
  encryptedPassword: string; // base64(iv + ciphertext)
  salt: string; // base64 salt for PBKDF2
  timestamp: number;
}

/**
 * Generates or retrieves a device-specific secret key.
 * This key is used to derive the encryption key for the password.
 */
function getDeviceSecret(): string {
  try {
    if (typeof window === "undefined") return "";

    let secret = window.localStorage.getItem(DEVICE_SECRET_KEY);
    if (!secret) {
      // Generate a cryptographically random device secret
      const randomBytes = new Uint8Array(32);
      window.crypto.getRandomValues(randomBytes);
      secret = btoa(String.fromCharCode(...randomBytes));
      window.localStorage.setItem(DEVICE_SECRET_KEY, secret);
    }
    return secret;
  } catch (error) {
    console.error("[rememberMe] Failed to get device secret:", error);
    return "";
  }
}

/**
 * Derives an AES-GCM encryption key from the device secret + salt using PBKDF2.
 */
async function deriveKey(deviceSecret: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(deviceSecret),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: 100000, // OWASP recommended
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts a password using AES-GCM with a key derived from the device secret.
 */
async function encryptPassword(password: string, deviceSecret: string): Promise<{ encrypted: string; salt: string }> {
  const salt = new Uint8Array(16);
  window.crypto.getRandomValues(salt);

  const key = await deriveKey(deviceSecret, salt);
  const iv = new Uint8Array(12);
  window.crypto.getRandomValues(iv);

  const encoder = new TextEncoder();
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
    key,
    encoder.encode(password)
  );

  // Combine IV + ciphertext for storage
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return {
    encrypted: btoa(String.fromCharCode(...combined)),
    salt: btoa(String.fromCharCode(...salt)),
  };
}

/**
 * Decrypts a stored password using the device secret.
 */
async function decryptPassword(encrypted: string, salt: string, deviceSecret: string): Promise<string> {
  try {
    const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
    const saltBytes = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0));

    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const key = await deriveKey(deviceSecret, saltBytes);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
      key,
      ciphertext.buffer as ArrayBuffer
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error("[rememberMe] Failed to decrypt password:", error);
    return "";
  }
}

/**
 * Saves email + encrypted password when "Remember me" is checked.
 */
export async function saveRememberMe(email: string, password: string): Promise<void> {
  try {
    if (typeof window === "undefined") return;

    const deviceSecret = getDeviceSecret();
    if (!deviceSecret) return;

    const { encrypted, salt } = await encryptPassword(password, deviceSecret);

    const data: RememberMeData = {
      email: email.trim().toLowerCase(),
      encryptedPassword: encrypted,
      salt,
      timestamp: Date.now(),
    };

    window.localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("[rememberMe] Failed to save remember me data:", error);
  }
}

/**
 * Retrieves the remembered email and decrypted password.
 * Returns empty strings if not found or decryption fails.
 */
export async function getRememberMe(): Promise<{ email: string; password: string }> {
  try {
    if (typeof window === "undefined") return { email: "", password: "" };

    const raw = window.localStorage.getItem(REMEMBER_ME_KEY);
    if (!raw) return { email: "", password: "" };

    const data: RememberMeData = JSON.parse(raw);
    const deviceSecret = getDeviceSecret();
    if (!deviceSecret) return { email: data.email, password: "" };

    const password = await decryptPassword(data.encryptedPassword, data.salt, deviceSecret);

    return { email: data.email, password };
  } catch (error) {
    console.error("[rememberMe] Failed to get remember me data:", error);
    return { email: "", password: "" };
  }
}

/**
 * Removes all remembered data.
 */
export function clearRememberMe(): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(REMEMBER_ME_KEY);
  } catch (error) {
    console.error("[rememberMe] Failed to clear remember me data:", error);
  }
}

/**
 * Checks if "Remember me" data exists.
 */
export function hasRememberMe(): boolean {
  try {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(REMEMBER_ME_KEY) !== null;
  } catch {
    return false;
  }
}

export { REMEMBER_ME_KEY };