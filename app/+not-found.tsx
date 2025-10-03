import { Redirect } from "expo-router";

/**
 * Not Found page - handles 404 errors by redirecting to index
 * 
 * This component is automatically used by expo-router when a route is not found
 * 
 * @returns {JSX.Element} Redirect to the home page
 */
export default function NotFoundPage() {
  return <Redirect href="/" />;
}
