import { useColorScheme } from "@/hooks/use-color-scheme";
import { LinkActions } from "@/utils/linkUtils";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FooterProps {
  /**
   * Optional custom styles to apply to the footer container
   */
  style?: any;
  /**
   * Whether to show the website link
   * @default true
   */
  showWebsiteLink?: boolean;
  /**
   * Custom copyright text
   * @default "© 2024 Typhon Solutions"
   */
  copyrightText?: string;
}

/**
 * Reusable footer component with website link and copyright
 *
 * @example
 * ```tsx
 * <Footer />
 * <Footer showWebsiteLink={false} />
 * <Footer copyrightText="© 2024 Custom Text" />
 * ```
 */
export default function Footer({
  style,
  showWebsiteLink = true,
  copyrightText = "© 2025 Typhon Solutions Pty Ltd",
}: FooterProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  /**
   * Handles opening the Chiron website URL using the reusable link utility
   */
  const handleChironWebsitePress = () => {
    LinkActions.openWebsite();
  };

  return (
    <View style={[styles.footer, style]}>
      {showWebsiteLink && (
        <TouchableOpacity
          onPress={handleChironWebsitePress}
          accessibilityRole="link"
          accessibilityLabel="Visit Chiron website"
        >
          <Text
            style={[
              styles.footerLink,
              { color: isDark ? "#007AFF" : "#0066CC" },
            ]}
          >
            Visit www.chironapp.com
          </Text>
        </TouchableOpacity>
      )}
      <Text
        style={[styles.footerText, { color: isDark ? "#888888" : "#666666" }]}
      >
        {copyrightText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 40,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 20,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 4,
  },
  footerLink: {
    fontSize: 14,
    marginBottom: 4,
    textDecorationLine: "underline",
  },
});
