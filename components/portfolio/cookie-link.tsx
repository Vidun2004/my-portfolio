"use client";

/** Re-opens the cookie consent banner. */
export function CookieLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("vidun:cookie-settings"))}
      className="hover:text-white"
    >
      COOKIES
    </button>
  );
}
