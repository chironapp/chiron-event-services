import { Head } from "@/components/utils/Head";
import ErrorPage from "@/components/ErrorPage";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, type ErrorBoundaryProps } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  const recover = () => {
    // Remounting the root Stack can reset navigation to its first screen.
    // Reload the current web URL so recovery keeps the visitor on their page.
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.location.reload();
    } else {
      void retry();
    }
  };
  return <ErrorPage onRetry={recover} />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Initialize iframe-resizer v4 for seamless embedding
  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      // Dynamically import iframe-resizer v4 content window script
      // Only load when embedded in an iframe
      if (window.self !== window.top) {
        import("iframe-resizer/js/iframeResizer.contentWindow");
      }
    }
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Head />
      <Stack>
        <Stack.Screen name="about" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
