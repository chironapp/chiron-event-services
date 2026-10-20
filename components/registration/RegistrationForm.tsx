import {
  submitRegistration,
  type RegistrationErrorCode,
} from "@/api/registration";
import ContactOrganiserLink from "@/components/registration/ContactOrganiserLink";
import SelectField from "@/components/registration/SelectField";
import TurnstileWidget, {
  type TurnstileWidgetHandle,
} from "@/components/registration/TurnstileWidget";
import { SEX_CATEGORY_OPTIONS } from "@/constants/sex";
import {
  REGISTRATION_ACTION_BACKGROUND,
  REGISTRATION_ON_FILL,
  REGISTRATION_SELECTED_BACKGROUND,
} from "@/constants/registrationColors";
import { Colors } from "@/constants/theme";
import { CHIRON_PRIVACY_URL, CHIRON_TERMS_URL } from "@/constants/urls";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LinkActions } from "@/utils/linkUtils";
import {
  REGISTRATION_ERROR_MESSAGES,
  validateRegistrationForm,
  type RegistrationFieldErrors,
  type RegistrationFormValues,
} from "@/utils/registrationUtils";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTH_OPTIONS = MONTHS.map((label, index) => ({
  value: String(index + 1),
  label,
}));

interface RegistrationFormProps {
  /** The event being registered for and which optional fields it records */
  event: {
    id: string;
    record_sex_category: boolean;
    record_age_category: boolean;
  };
  /** organisers.public_contact, for the "Contact organiser" link */
  contact: string | null;
  /** Turnstile site key (EXPO_PUBLIC_TURNSTILE_SITE_KEY) */
  siteKey: string | undefined;
  /** Called after the entry is created */
  onRegistered: (eventId: string) => void;
  /** Called when the server says registration is no longer possible */
  onUnavailable: (code: RegistrationErrorCode) => void;
}

const EMPTY_VALUES: RegistrationFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  sexCategoryId: null,
  monthOfBirth: null,
  yearOfBirth: null,
};

/**
 * Public registration form. Asks for first name, last name and email, plus sex
 * and month/year of birth when the event records them (never a bib number).
 * Each submission needs a fresh Turnstile token, so the check is reset after
 * every failed attempt.
 */
export default function RegistrationForm({
  event,
  contact,
  siteKey,
  onRegistered,
  onUnavailable,
}: RegistrationFormProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  const [values, setValues] = useState<RegistrationFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<RegistrationFieldErrors>({});
  const [token, setToken] = useState<string | null>(null);
  const [checkFailed, setCheckFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => {
    const year = String(currentYear - i);
    return { value: year, label: year };
  });

  const update = <K extends keyof RegistrationFormValues>(
    key: K,
    value: RegistrationFormValues[K]
  ) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    // Clear the message for a field as soon as it is edited
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  const resetCheck = () => {
    setToken(null);
    turnstileRef.current?.reset();
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setFormError(null);

    const fieldErrors = validateRegistrationForm(values, event);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      setFormError(REGISTRATION_ERROR_MESSAGES.validation_error);
      return;
    }
    if (!token) {
      setFormError("Please complete the security check below.");
      return;
    }

    setSubmitting(true);
    const result = await submitRegistration({
      ...values,
      eventId: event.id,
      turnstileToken: token,
    });
    setSubmitting(false);

    if (result.ok) {
      onRegistered(result.eventId);
      return;
    }

    // A token is accepted once, so every failure needs a fresh check
    resetCheck();
    if (result.code === "validation_error") {
      setErrors(result.fieldErrors ?? {});
    }
    if (
      result.code === "registration_closed" ||
      result.code === "registration_not_available" ||
      result.code === "event_not_found"
    ) {
      // Shown if the page still looks open after it reloads the event
      setFormError(REGISTRATION_ERROR_MESSAGES[result.code]);
      onUnavailable(result.code);
      return;
    }
    setFormError(REGISTRATION_ERROR_MESSAGES[result.code]);
  };

  const inputStyle = (error?: string) => [
    styles.input,
    {
      color: colors.text,
      backgroundColor: colors.background,
      borderColor: error ? colors.error : colors.border,
    },
  ];

  if (!siteKey) {
    console.error("EXPO_PUBLIC_TURNSTILE_SITE_KEY is not set");
    return (
      <Text style={[styles.formError, { color: colors.error }]}>
        Registration is temporarily unavailable. Please try again later.
      </Text>
    );
  }

  const canSubmit = !submitting && !!token;

  return (
    <View>
      <Text style={[styles.label, { color: colors.text }]}>First name</Text>
      <TextInput
        style={inputStyle(errors.firstName)}
        value={values.firstName}
        onChangeText={(text) => update("firstName", text)}
        autoComplete="given-name"
        maxLength={100}
        accessibilityLabel="First name"
      />
      {!!errors.firstName && (
        <Text style={[styles.fieldError, { color: colors.error }]}>{errors.firstName}</Text>
      )}

      <Text style={[styles.label, { color: colors.text }]}>Last name</Text>
      <TextInput
        style={inputStyle(errors.lastName)}
        value={values.lastName}
        onChangeText={(text) => update("lastName", text)}
        autoComplete="family-name"
        maxLength={100}
        accessibilityLabel="Last name"
      />
      {!!errors.lastName && (
        <Text style={[styles.fieldError, { color: colors.error }]}>{errors.lastName}</Text>
      )}

      <Text style={[styles.label, { color: colors.text }]}>Email</Text>
      <TextInput
        style={inputStyle(errors.email)}
        value={values.email}
        onChangeText={(text) => update("email", text)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        maxLength={254}
        accessibilityLabel="Email"
      />
      {!!errors.email && (
        <Text style={[styles.fieldError, { color: colors.error }]}>{errors.email}</Text>
      )}

      {event.record_sex_category && (
        <View style={styles.group}>
          <Text style={[styles.label, { color: colors.text }]}>Sex</Text>
          <View style={styles.radioRow} accessibilityRole="radiogroup">
            {SEX_CATEGORY_OPTIONS.map((option) => {
              const selected = values.sexCategoryId === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => update("sexCategoryId", option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  style={[
                    styles.radio,
                    {
                      borderColor: errors.sexCategoryId
                        ? colors.error
                        : selected
                          ? REGISTRATION_SELECTED_BACKGROUND
                          : colors.border,
                      backgroundColor: selected
                        ? REGISTRATION_SELECTED_BACKGROUND
                        : colors.background,
                    },
                  ]}
                >
                  <Text style={{ color: selected ? REGISTRATION_ON_FILL : colors.text }}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
          {!!errors.sexCategoryId && (
            <Text style={[styles.fieldError, { color: colors.error }]}>
              {errors.sexCategoryId}
            </Text>
          )}
        </View>
      )}

      {event.record_age_category && (
        <View style={styles.birthRow}>
          <View style={styles.birthMonth}>
            <SelectField
              label="Month of birth"
              value={values.monthOfBirth === null ? "" : String(values.monthOfBirth)}
              onChange={(v) => update("monthOfBirth", v === "" ? null : Number(v))}
              options={MONTH_OPTIONS}
              placeholder="Month"
              error={errors.monthOfBirth}
            />
          </View>
          <View style={styles.birthYear}>
            <SelectField
              label="Year of birth"
              value={values.yearOfBirth === null ? "" : String(values.yearOfBirth)}
              onChange={(v) => update("yearOfBirth", v === "" ? null : Number(v))}
              options={yearOptions}
              placeholder="Year"
              error={errors.yearOfBirth}
            />
          </View>
        </View>
      )}

      <View style={styles.turnstile}>
        <TurnstileWidget
          ref={turnstileRef}
          siteKey={siteKey}
          onToken={(value) => {
            setToken(value);
            setCheckFailed(false);
          }}
          onExpire={() => setToken(null)}
          onError={() => {
            setToken(null);
            setCheckFailed(true);
          }}
        />
        {checkFailed && (
          <Text style={[styles.fieldError, { color: colors.error }]}>
            The security check could not run. Turn off any content blocker for this
            page and refresh, or contact the organiser.
          </Text>
        )}
      </View>

      {!!formError && (
        <View accessibilityRole="alert" style={styles.formErrorBox}>
          <Text style={[styles.formError, { color: colors.error }]}>{formError}</Text>
        </View>
      )}

      <Text style={[styles.legal, { color: colors.subText }]}>
        By registering you agree to the{" "}
        <Text
          style={{ color: colors.link }}
          accessibilityRole="link"
          onPress={() => LinkActions.openInNewTab(CHIRON_TERMS_URL, "Error opening terms")}
        >
          Terms
        </Text>{" "}
        and{" "}
        <Text
          style={{ color: colors.link }}
          accessibilityRole="link"
          onPress={() => LinkActions.openInNewTab(CHIRON_PRIVACY_URL, "Error opening privacy policy")}
        >
          Privacy Policy
        </Text>
        . Your details are shared with the event organiser.
      </Text>

      <Pressable
        onPress={handleSubmit}
        disabled={!canSubmit}
        accessibilityRole="button"
        accessibilityState={{ disabled: !canSubmit, busy: submitting }}
        style={[
          styles.submit,
          { backgroundColor: REGISTRATION_ACTION_BACKGROUND, opacity: canSubmit ? 1 : 0.5 },
        ]}
      >
        {submitting ? (
          <ActivityIndicator color={REGISTRATION_ON_FILL} />
        ) : (
          <Text style={styles.submitText}>Register</Text>
        )}
      </Pressable>

      <View style={styles.contact}>
        <ContactOrganiserLink contact={contact} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, marginTop: 4 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  fieldError: { fontSize: 13, marginTop: -6, marginBottom: 12 },
  group: { marginBottom: 8 },
  radioRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  radio: { borderWidth: 1, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16 },
  birthRow: { flexDirection: "row", gap: 12 },
  birthMonth: { flex: 3 },
  birthYear: { flex: 2 },
  turnstile: { marginVertical: 8 },
  formErrorBox: { marginBottom: 12 },
  formError: { fontSize: 15, lineHeight: 22 },
  submit: {
    height: 52,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitText: { color: REGISTRATION_ON_FILL, fontSize: 17, fontWeight: "600" },
  legal: { fontSize: 13, lineHeight: 20, marginTop: 4, marginBottom: 8 },
  contact: { marginTop: 16, marginBottom: 8 },
});
