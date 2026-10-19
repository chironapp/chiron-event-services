import type { RegistrationErrorCode } from "@/api/registration";
import type { RegistrationMode } from "@/constants/raceTypes";

/**
 * Helpers for the public race registration page and the "Register Now" button.
 * Rules mirror the registration Edge Function (chironapp: register-for-event)
 * and the organisers.public_contact database constraint.
 */

/** The event fields registration depends on. */
export type RegistrationEvent = {
  id: string;
  race_status: string | null;
  registration_mode: RegistrationMode | string;
  registration_url: string | null;
};

/**
 * What the registration page should show for an event.
 * - open: show the form
 * - closed: Chiron registration, but the status is not "registration open"
 * - elsewhere: the organiser takes registrations on their own link
 * - unavailable: the organiser has not set up registration
 */
export type RegistrationAvailability =
  | "open"
  | "closed"
  | "elsewhere"
  | "unavailable";

/**
 * Decides what the registration page shows. The server makes the same decision
 * again on submit; this is for display only.
 *
 * @param event - The event's registration fields
 * @returns The availability state
 */
export function getRegistrationAvailability(
  event: RegistrationEvent
): RegistrationAvailability {
  if (event.registration_mode === "chiron") {
    return event.race_status === "registration_open" ? "open" : "closed";
  }
  if (event.registration_mode === "custom") return "elsewhere";
  return "unavailable";
}

/**
 * Whether a URL is safe to open from a link: http or https only. Organisers
 * type their own registration link, so other schemes such as `javascript:` must
 * never be opened.
 *
 * @param url - The URL to check
 * @returns True for an http(s) URL
 */
export function isHttpUrl(url: string | null | undefined): url is string {
  return !!url && /^https?:\/\/\S+$/i.test(url.trim());
}

/** Where the "Register Now" button goes. */
export type RegistrationTarget =
  | { kind: "internal"; href: string }
  | { kind: "external"; url: string };

/**
 * Resolves the "Register Now" button for an event, or null for no button.
 * A button only shows while the status is registration open; the registration
 * mode picks the destination (the hosted page, or the organiser's own link).
 *
 * @param event - The event's registration fields
 * @returns The button target, or null
 */
export function getRegistrationTarget(
  event: RegistrationEvent
): RegistrationTarget | null {
  if (event.race_status !== "registration_open") return null;
  if (event.registration_mode === "chiron") {
    return { kind: "internal", href: `/events/${event.id}/register` };
  }
  if (event.registration_mode === "custom" && isHttpUrl(event.registration_url)) {
    return { kind: "external", url: event.registration_url.trim() };
  }
  return null;
}

// No ':' or '/' in an email, so scheme-like input is never taken for one
const EMAIL_PATTERN = /^[^@\s:/]+@[^@\s:/]+\.[^@\s:/]+$/i;

/**
 * Basic email shape check, the same rule the server applies.
 *
 * @param value - The email as entered
 * @returns True if it looks like an email address
 */
export function isPlausibleEmail(value: string): boolean {
  const email = value.trim();
  return email.length > 0 && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Turns a club's public contact into a link target: `mailto:` for an email
 * address, the address itself for an http(s) link, otherwise null. Anything else
 * (for example `javascript:`) is never linked.
 *
 * @param contact - organisers.public_contact
 * @returns The href to open, or null if there is nothing safe to link
 */
export function getContactHref(contact: string | null | undefined): string | null {
  const value = contact?.trim();
  if (!value || value.length > 500) return null;
  if (EMAIL_PATTERN.test(value)) return `mailto:${value}`;
  if (isHttpUrl(value)) return value;
  return null;
}

/** What the visitor typed on the form. */
export type RegistrationFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  sexCategoryId: number | null;
  monthOfBirth: number | null;
  yearOfBirth: number | null;
};

export type RegistrationFieldErrors = Partial<
  Record<
    "firstName" | "lastName" | "email" | "sexCategoryId" | "monthOfBirth" | "yearOfBirth",
    string
  >
>;

/**
 * Checks the form before submitting, mirroring the server so most mistakes are
 * caught without a round trip. The server validates again.
 *
 * @param values - The form values
 * @param event - Which optional fields the event records
 * @param now - Current date (bounds the year of birth); injectable for tests
 * @returns Field errors, empty when the form is valid
 */
export function validateRegistrationForm(
  values: RegistrationFormValues,
  event: { record_sex_category: boolean; record_age_category: boolean },
  now: Date = new Date()
): RegistrationFieldErrors {
  const errors: RegistrationFieldErrors = {};
  if (!values.firstName.trim()) errors.firstName = "First name is required";
  else if (values.firstName.trim().length > 100) errors.firstName = "First name is too long";
  if (!values.lastName.trim()) errors.lastName = "Last name is required";
  else if (values.lastName.trim().length > 100) errors.lastName = "Last name is too long";
  if (!values.email.trim()) errors.email = "Email is required";
  else if (!isPlausibleEmail(values.email)) errors.email = "Enter a valid email address";

  if (event.record_sex_category && values.sexCategoryId === null) {
    errors.sexCategoryId = "Select a sex";
  }
  if (event.record_age_category) {
    if (values.monthOfBirth === null) errors.monthOfBirth = "Select a month of birth";
    if (
      values.yearOfBirth === null ||
      values.yearOfBirth < 1900 ||
      values.yearOfBirth > now.getFullYear()
    ) {
      errors.yearOfBirth = "Enter a valid year of birth";
    }
  }
  return errors;
}

/**
 * What to tell the visitor for each failure. The duplicate message is the same
 * whichever rule matched, and never says which, so it cannot be used to find out
 * who is registered.
 */
export const REGISTRATION_ERROR_MESSAGES: Record<RegistrationErrorCode, string> = {
  validation_error: "Please check the highlighted fields and try again.",
  turnstile_failed:
    "We couldn't verify the security check. Please try again.",
  duplicate:
    "It looks like you're already on this event's start list. If you think this is a mistake, please contact the organiser.",
  registration_closed: "Registration for this event is closed.",
  registration_not_available:
    "Online registration isn't available for this event.",
  event_not_found: "We couldn't find this event.",
  server_error: "Something went wrong. Please try again.",
  network_error:
    "We couldn't reach the server. Check your connection and try again.",
};
