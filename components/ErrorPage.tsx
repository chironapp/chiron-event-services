import { CHIRON_REPORT_ISSUE_URL } from "@/constants/urls";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Link, type ErrorBoundaryProps } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ErrorPageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/** Catch a screen failure while retaining the parent navigation and URL. */
export function PublicPageErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <ErrorPage onRetry={retry} />;
}

/** Shared fallback for caught request failures and route error boundaries.
 * Keep technical errors in logs; give visitors a way to recover or get help.
 */
export function ErrorNotice({
  title = "We couldn't load this page",
  message = "Please try again. If the problem continues, report the issue and include the page address.",
  onRetry,
}: ErrorPageProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View testID="public-page-error" accessibilityRole="alert" style={styles.notice}>
      <Text role="heading" aria-level={1} style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>
      <Text style={[styles.message, { color: colors.subText }]}>{message}</Text>
      {onRetry && (
        <Pressable accessibilityRole="button" onPress={onRetry}
          style={[styles.retry, { borderColor: colors.link }]}>
          <Text style={[styles.link, { color: colors.link }]}>Try again</Text>
        </Pressable>
      )}
      <Link href="/" style={[styles.link, { color: colors.link }]}>Back to events</Link>
      <Link href={CHIRON_REPORT_ISSUE_URL} target="_blank" rel="noopener noreferrer"
        style={[styles.link, { color: colors.link }]}>Report an issue</Link>
    </View>
  );
}

export default function ErrorPage(props: ErrorPageProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <ErrorNotice {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  notice: { width: "100%", maxWidth: 560, alignSelf: "center", alignItems: "center", gap: 16, paddingVertical: 32 },
  title: { fontSize: 26, fontWeight: "700", textAlign: "center" },
  message: { fontSize: 16, lineHeight: 24, textAlign: "center" },
  link: { fontSize: 16, paddingVertical: 8, textDecorationLine: "underline" },
  retry: { minHeight: 44, borderWidth: 1, borderRadius: 8, paddingHorizontal: 24 },
});
