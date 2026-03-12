import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid";

/**
 * Merge Tailwind CSS classes with clsx for conditional class names
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date for Thai locale display
 * @param date - Date string or Date object
 * @param pattern - date-fns format pattern (default: "d MMMM yyyy")
 */
export function formatDate(
  date: string | Date,
  pattern: string = "d MMMM yyyy"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, pattern, { locale: th });
}

/**
 * Generate a unique certificate code
 * Format: AIBA-COURSECODE-YYYY-XXXX (e.g., AIBA-AIMKT-2026-0001)
 */
export function generateCertificateCode(
  courseCode: string,
  year: number,
  sequence: number
): string {
  return `AIBA-${courseCode}-${year}-${String(sequence).padStart(4, "0")}`;
}

/**
 * Map course level enum to Thai label
 */
export const levelLabels: Record<string, string> = {
  BEGINNER: "เริ่มต้น",
  INTERMEDIATE: "ปานกลาง",
  ADVANCED: "ขั้นสูง",
};

/**
 * Convert various YouTube URL formats to an embeddable URL
 * Supports:
 *   - https://www.youtube.com/watch?v=VIDEO_ID
 *   - https://youtu.be/VIDEO_ID
 *   - https://www.youtube.com/embed/VIDEO_ID
 *   - https://www.youtube.com/watch?v=VIDEO_ID&t=120
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;

  let videoId: string | null = null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    } else if (
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "youtube.com"
    ) {
      if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.split("/embed/")[1];
      } else if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v");
      }
    }
  } catch {
    // Try regex fallback for non-standard formats
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (match) {
      videoId = match[1];
    }
  }

  if (!videoId) return null;

  // Strip any extra path segments or query params from the video ID
  videoId = videoId.split(/[?&/]/)[0];

  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Calculate progress percentage from completed and total counts
 * @returns A number between 0 and 100, rounded to 1 decimal
 */
export function calculateProgress(completed: number, total: number): number {
  if (total <= 0) return 0;
  const progress = (completed / total) * 100;
  return Math.round(progress * 10) / 10;
}

/**
 * Convert a text string into a URL-friendly slug
 * Handles both English and Thai text
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w\u0E00-\u0E7F-]+/g, "") // Remove non-word chars (keep Thai)
    .replace(/--+/g, "-") // Replace multiple hyphens
    .replace(/^-+/, "") // Trim leading hyphens
    .replace(/-+$/, ""); // Trim trailing hyphens
}
