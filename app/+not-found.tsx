import ErrorPage from "@/components/ErrorPage";
import { Stack } from "expo-router";

/** Show a useful fallback when a public URL does not match a route. */
export default function NotFoundPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, title: "Page not found" }} />
      <ErrorPage
        title="Page not found"
        message="This page may have moved or the address may be incorrect."
      />
    </>
  );
}
