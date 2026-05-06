/**
 * Lightweight typings for the InPost EasyPack widget v4.
 * The official SDK ships no types; these cover the surface we use in checkout.
 *
 * Reference: https://geowidget.easypack24.net/js/sdk-for-javascript.js
 */

export type InPostPoint = {
  /** Paczkomat code, e.g. "WAW123M" */
  name: string;
  /** Human-readable address, e.g. "ul. Marszałkowska 1" */
  address: {
    line1: string;
    line2?: string;
  };
  /** City, e.g. "Warszawa" */
  city?: string;
  /** Postal code, e.g. "00-001" */
  postal_code?: string;
};

export type InPostModal = {
  closeModal: () => void;
};

export type EasyPackModalMapOptions = {
  language?: "pl" | "en";
  /** Map type: "osm" (default) or "google" */
  mapType?: "osm" | "google";
};

export type EasyPackSDK = {
  modalMap: (
    onSelect: (point: InPostPoint, modal: InPostModal) => void,
    options?: EasyPackModalMapOptions,
  ) => void;
};

declare global {
  interface Window {
    easyPack?: EasyPackSDK;
  }
}

// `export {}` makes this a module so the global augmentation is picked up.
export {};
