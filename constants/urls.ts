/**
 * URL constants for external links and resources
 */

// Company website and contact
export const CHIRON_WEBSITE_URL = "https://www.chironapp.com/";
export const CHIRON_CONTACT_URL = "https://www.chironapp.com/contact";

// Legal pages linked from forms that collect personal data
export const CHIRON_TERMS_URL = "https://www.chironapp.com/terms/";
export const CHIRON_PRIVACY_URL = "https://www.chironapp.com/privacy/";

// Cloudflare Turnstile (anti-bot check on the public registration form)
export const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

// Supabase Edge Function that turns a registration into a start list entry
export const REGISTER_FOR_EVENT_FUNCTION_PATH =
  "/functions/v1/register-for-event";

// Contact email for support
export const CHIRON_SUPPORT_EMAIL = "support@chironapp.com";

// Organized URL constants for easy access
export const EXTERNAL_URLS = {
  CHIRON_WEBSITE: CHIRON_WEBSITE_URL,
  CHIRON_CONTACT: CHIRON_CONTACT_URL,
  CHIRON_SUPPORT_EMAIL: CHIRON_SUPPORT_EMAIL,
  CHIRON_TERMS: CHIRON_TERMS_URL,
  CHIRON_PRIVACY: CHIRON_PRIVACY_URL,
} as const;
