import { useSyncExternalStore } from "react";

/**
 * The current time, re-read every `intervalMs`. Returns null during server
 * rendering and hydration so clocks never mismatch between server and client.
 */
export function useNow(intervalMs = 30_000): Date | null {
  const tick = useSyncExternalStore(
    (onChange) => {
      const id = window.setInterval(onChange, intervalMs);
      return () => window.clearInterval(id);
    },
    () => Math.floor(Date.now() / intervalMs),
    () => null,
  );
  return tick === null ? null : new Date();
}
