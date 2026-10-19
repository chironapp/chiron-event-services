import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LinkActions } from "@/utils/linkUtils";
import { getContactHref } from "@/utils/registrationUtils";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ContactOrganiserLinkProps {
  /** organisers.public_contact: an email address or an http(s) link */
  contact: string | null | undefined;
}

/**
 * "Contact organiser" link. An email address opens the visitor's mail client;
 * a website link opens in the browser. Renders nothing when the club has no
 * contact, or one that is not safe to link.
 */
export default function ContactOrganiserLink({ contact }: ContactOrganiserLinkProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const href = getContactHref(contact);
  if (!href) return null;

  return (
    <TouchableOpacity
      onPress={() =>
        // A website opens in a new tab so the form keeps what was typed; a mailto:
        // link hands over to the mail client without leaving the page
        href.startsWith("mailto:")
          ? LinkActions.openLink(href, "Error opening organiser contact")
          : LinkActions.openInNewTab(href, "Error opening organiser contact")
      }
      accessibilityRole="link"
      accessibilityLabel="Contact organiser"
    >
      <Text style={[styles.link, { color: colors.link }]}>Contact organiser</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  link: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
