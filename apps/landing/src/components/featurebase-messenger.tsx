"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Featurebase?: {
      (...args: unknown[]): void;
      q?: unknown[];
    };
  }
}

function bootFeaturebase() {
  if (typeof window === "undefined") return;

  const win = window;
  if (typeof win.Featurebase !== "function") {
    console.warn("Featurebase SDK not loaded yet");
    return;
  }

  win.Featurebase("boot", {
    appId: "69ecac10fbb00ef1c7b64475",
    theme: "light",
    language: "en",
  });
}

const FeaturebaseMessenger = () => {
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    if (sdkLoaded) {
      bootFeaturebase();
    }
  }, [sdkLoaded]);

  return (
    <>
      <Script
        src="https://do.featurebase.app/js/sdk.js"
        id="featurebase-sdk"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Featurebase SDK loaded");
          setSdkLoaded(true);
        }}
      />
    </>
  );
};

export default FeaturebaseMessenger;
