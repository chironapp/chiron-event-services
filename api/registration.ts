import { REGISTER_FOR_EVENT_FUNCTION_PATH } from "@/constants/urls";
import type {
  RegistrationFieldErrors,
  RegistrationFormValues,
} from "@/utils/registrationUtils";

/**
 * Submits a public race registration to the `register-for-event` Edge Function
 * (chironapp). The function verifies the Turnstile token, applies the event's
 * rules and creates the start list entry; this module only maps its response to
 * a typed result.
 */

export type RegistrationErrorCode =
  | "validation_error"
  | "turnstile_failed"
  | "duplicate"
  | "registration_closed"
  | "registration_not_available"
  | "event_not_found"
  | "server_error"
  | "network_error";

export type RegistrationResult =
  | { ok: true; eventId: string; entryId: string }
  | {
      ok: false;
      code: RegistrationErrorCode;
      /** Per-field messages when code is validation_error */
      fieldErrors?: RegistrationFieldErrors;
    };

export type RegistrationPayload = RegistrationFormValues & {
  eventId: string;
  /** Single-use Cloudflare Turnstile token */
  turnstileToken: string;
};

const KNOWN_CODES: RegistrationErrorCode[] = [
  "validation_error",
  "turnstile_failed",
  "duplicate",
  "registration_closed",
  "registration_not_available",
  "event_not_found",
  "server_error",
];

/**
 * Sends a registration.
 *
 * @param payload - The form values, event id and Turnstile token
 * @param options - Overrides for the function base URL and fetch (for tests)
 * @returns The new entry's ids, or an error code the page can show a message for
 *
 * @example
 * ```ts
 * const result = await submitRegistration({ eventId, turnstileToken, ...values });
 * if (result.ok) router.replace(`/events/${result.eventId}?registered=1`);
 * ```
 */
export async function submitRegistration(
  payload: RegistrationPayload,
  options: { baseUrl?: string; fetchImpl?: typeof fetch } = {}
): Promise<RegistrationResult> {
  const baseUrl = options.baseUrl ?? process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
  const doFetch = options.fetchImpl ?? fetch;

  // Optional fields are only sent when answered
  const body: Record<string, unknown> = {
    eventId: payload.eventId,
    turnstileToken: payload.turnstileToken,
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: payload.email.trim(),
  };
  if (payload.sexCategoryId !== null) body.sexCategoryId = payload.sexCategoryId;
  if (payload.monthOfBirth !== null) body.monthOfBirth = payload.monthOfBirth;
  if (payload.yearOfBirth !== null) body.yearOfBirth = payload.yearOfBirth;

  let response: Response;
  try {
    response = await doFetch(`${baseUrl}${REGISTER_FOR_EVENT_FUNCTION_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, code: "network_error" };
  }

  let json: any = null;
  try {
    json = await response.json();
  } catch {
    // not JSON: handled below
  }

  if (response.ok && json?.eventId && json?.entryId) {
    return { ok: true, eventId: json.eventId, entryId: json.entryId };
  }

  const code: RegistrationErrorCode = KNOWN_CODES.includes(json?.error)
    ? json.error
    : "server_error";
  return {
    ok: false,
    code,
    ...(code === "validation_error" && json?.errors ? { fieldErrors: json.errors } : {}),
  };
}
