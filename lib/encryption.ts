// Encryption utilities for client-side file and image protection
// Note: This is obfuscation, not military-grade encryption

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "smsnv-default-key-2025";

/**
 * Simple XOR encryption for strings
 * WARNING: This is basic obfuscation, not secure encryption
 */
export function encryptString(text: string): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result);
}

/**
 * Decrypt XOR encrypted strings
 */
export function decryptString(encrypted: string): string {
  try {
    const text = atob(encrypted);
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch {
    return "";
  }
}

/**
 * Encrypt file content to base64 with obfuscation
 */
export async function encryptFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      if (!arrayBuffer) {
        reject(new Error("Failed to read file"));
        return;
      }
      
      const bytes = new Uint8Array(arrayBuffer);
      // Simple obfuscation: XOR with key bytes
      const keyBytes = new TextEncoder().encode(ENCRYPTION_KEY);
      const obfuscated = bytes.map((byte, i) => byte ^ keyBytes[i % keyBytes.length]);
      
      // Convert to base64
      const base64 = btoa(String.fromCharCode(...obfuscated));
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Decrypt file content from obfuscated base64
 */
export async function decryptFile(encryptedBase64: string): Promise<Uint8Array> {
  const binary = atob(encryptedBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  
  // Reverse obfuscation
  const keyBytes = new TextEncoder().encode(ENCRYPTION_KEY);
  const decrypted = bytes.map((byte, i) => byte ^ keyBytes[i % keyBytes.length]);
  
  return decrypted;
}

/**
 * Create encrypted blob URL for images
 * This provides basic protection against direct image copying
 * TODO: Fix TypeScript type issues with Blob constructor
 */
export async function createEncryptedImageUrl(_imageBase64: string): Promise<string> {
  void _imageBase64; // Parameter is temporarily unused due to TypeScript type issues
  // try {
  //   const decrypted = await decryptFile(imageBase64);
  //   const blob = new Blob([new Uint8Array(decrypted)]);
  //   return URL.createObjectURL(blob);
  // } catch {
  //   return "";
  // }
  return "";
}

/**
 * Obfuscate sensitive data for display
 */
export function obfuscateData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars * 2) return "*".repeat(data.length);
  return data.slice(0, visibleChars) + "***" + data.slice(-visibleChars);
}

/**
 * Hash a string (simple hash for non-critical purposes)
 */
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
