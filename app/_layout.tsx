import { Head } from "@/components/utils/Head";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const lastHeightRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Communicate iframe height to parent window for seamless embedding
  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const sendHeight = () => {
        requestAnimationFrame(() => {
          const height = document.body.scrollHeight;

          // Only send if height actually changed (prevent infinite loops)
          if (Math.abs(height - lastHeightRef.current) > 5) {
            lastHeightRef.current = height;
            window.parent.postMessage(
              {
                type: "chiron:iframe:resize",
                height,
                source: "chiron-events",
              },
              "*"
            );
          }
        });
      };

      // Debounced version to prevent excessive calls
      const debouncedSendHeight = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(
          sendHeight,
          150
        ) as unknown as NodeJS.Timeout;
      };

      // Send height on route change (with staggered retries for async content)
      sendHeight();
      const timeout1 = setTimeout(sendHeight, 100);
      const timeout2 = setTimeout(sendHeight, 300);
      const timeout3 = setTimeout(sendHeight, 600);

      // Observe size changes (less aggressive)
      const resizeObserver = new ResizeObserver(debouncedSendHeight);
      resizeObserver.observe(document.body);

      // Less aggressive MutationObserver to prevent infinite loops
      const mutationObserver = new MutationObserver(debouncedSendHeight);
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: false, // Don't watch entire tree to prevent excessive triggers
        attributes: false, // Don't watch attribute changes
      });

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
        resizeObserver.disconnect();
        mutationObserver.disconnect();
      };
    }
  }, [pathname]); // Re-run on route changes

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
