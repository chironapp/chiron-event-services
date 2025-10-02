import { CHIRON_WEBSITE_URL } from "@/constants/urls";
import * as Linking from "expo-linking";

/**
 * Utility functions for handling external links
 */

/**
 * Generic function to open external URLs with error handling
 * @param url - The URL to open
 * @param errorMessage - Custom error message for logging
 */
export const openExternalLink = async (url: string, errorMessage?: string) => {
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.error(errorMessage || `Error opening URL: ${url}`, error);
  }
};

/**
 * Opens the Chiron website homepage
 *
 * @example
 * ```tsx
 * <TouchableOpacity onPress={openChironWebsite}>
 *   <Text>Visit Website</Text>
 * </TouchableOpacity>
 * ```
 */
export const openChironWebsite = async () => {
  await openExternalLink(CHIRON_WEBSITE_URL, "Error opening Chiron website");
};

/**
 * Opens the Chiron contact page
 *
 * @example
 * ```tsx
 * <TouchableOpacity onPress={openChironContact}>
 *   <Text>Contact Us</Text>
 * </TouchableOpacity>
 * ```
 */
export const openChironContact = async () => {
  const contactUrl = `${CHIRON_WEBSITE_URL}contact`;
  await openExternalLink(contactUrl, "Error opening Chiron contact page");
};

/**
 * Opens an email client with pre-filled recipient
 * @param email - The email address to send to
 * @param subject - Optional email subject
 * @param body - Optional email body
 *
 * @example
 * ```tsx
 * openEmailClient('support@chironapp.com', 'Support Request', 'Hello, I need help with...');
 * ```
 */
export const openEmailClient = async (
  email: string,
  subject?: string,
  body?: string
) => {
  let emailUrl = `mailto:${email}`;

  const params = new URLSearchParams();
  if (subject) params.append("subject", subject);
  if (body) params.append("body", body);

  const queryString = params.toString();
  if (queryString) {
    emailUrl += `?${queryString}`;
  }

  await openExternalLink(emailUrl, `Error opening email client for ${email}`);
};

/**
 * Link utility constants for common actions
 */
export const LinkActions = {
  openWebsite: openChironWebsite,
  openContact: openChironContact,
  openEmail: openEmailClient,
  openLink: openExternalLink,
} as const;
