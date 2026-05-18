import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Returns `true` only after the component has hydrated on the client.
 *
 * Use this whenever you need to gate UI on data that lives in `localStorage`
 * (Zustand persist, cookie consent, age gate, etc.) so the SSR markup matches
 * the first client paint.
 *
 * Implementation note: built on `useSyncExternalStore` with `getServerSnapshot`
 * returning `false` and `getClientSnapshot` returning `true`. This is the
 * canonical React 18+ pattern — it is preferred over `useState(false) +
 * useEffect(() => setTrue, [])` because the React 19 lint rule
 * `react-hooks/set-state-in-effect` (correctly) flags that older pattern as
 * a state-cascading anti-pattern.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
