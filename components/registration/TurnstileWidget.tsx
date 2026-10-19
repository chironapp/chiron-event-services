import { TURNSTILE_SCRIPT_URL } from "@/constants/urls";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Platform, View } from "react-native";

/** The parts of Cloudflare's `window.turnstile` this component uses. */
type TurnstileApi = {
  ready?: (callback: () => void) => void;
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileWidgetHandle = {
  /** Clears the current token and shows a fresh check. Tokens are single use. */
  reset: () => void;
};

interface TurnstileWidgetProps {
  /** Public site key for the widget */
  siteKey: string;
  /** Called with a token once the visitor passes the check */
  onToken: (token: string) => void;
  /** Called when the token expires or the check has to be redone */
  onExpire: () => void;
  /** Called when the widget cannot run (for example blocked or offline) */
  onError: () => void;
}

let scriptPromise: Promise<TurnstileApi> | null = null;

/**
 * Loads Cloudflare's Turnstile script once and resolves with its API.
 *
 * @returns The `window.turnstile` API
 * @throws When the script cannot be loaded
 */
function loadTurnstile(): Promise<TurnstileApi> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
    const ready = () => {
      const api = window.turnstile;
      if (!api) return reject(new Error("Turnstile did not initialise"));
      if (api.ready) api.ready(() => resolve(api));
      else resolve(api);
    };
    if (window.turnstile) return ready();

    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = ready;
    script.onerror = () => {
      scriptPromise = null; // allow a retry on the next mount
      reject(new Error("Could not load Turnstile"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Cloudflare Turnstile check for the registration form (web only). It renders
 * the widget explicitly, reports the token, and can be reset after a submit
 * because each token is accepted once.
 *
 * Nothing touches `window` or `document` until the effect runs, so static
 * rendering at build time is unaffected.
 */
const TurnstileWidget = forwardRef<TurnstileWidgetHandle, TurnstileWidgetProps>(
  function TurnstileWidget({ siteKey, onToken, onExpire, onError }, ref) {
    const containerRef = useRef<any>(null);
    const widgetIdRef = useRef<string | null>(null);
    // Keep the latest callbacks without re-rendering the widget
    const callbacks = useRef({ onToken, onExpire, onError });
    callbacks.current = { onToken, onExpire, onError };

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
    }));

    useEffect(() => {
      if (Platform.OS !== "web") return;
      let cancelled = false;

      loadTurnstile()
        .then((api) => {
          if (cancelled || !containerRef.current) return;
          widgetIdRef.current = api.render(containerRef.current, {
            sitekey: siteKey,
            theme: "auto",
            callback: (token: string) => callbacks.current.onToken(token),
            "expired-callback": () => callbacks.current.onExpire(),
            "error-callback": () => callbacks.current.onError(),
          });
        })
        .catch((error) => {
          console.error("Turnstile failed to load:", error);
          if (!cancelled) callbacks.current.onError();
        });

      return () => {
        cancelled = true;
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
        }
        widgetIdRef.current = null;
      };
    }, [siteKey]);

    if (Platform.OS !== "web") return null;
    return <View ref={containerRef} />;
  }
);

export default TurnstileWidget;
