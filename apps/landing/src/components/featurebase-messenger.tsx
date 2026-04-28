"use client";
import { useEffect } from "react";
import Script from "next/script";

const FeaturebaseMessenger = () => {
  useEffect(() => {
    const win = window;

    if (typeof win.Featurebase !== "function") {
      win.Featurebase = function () {
        (win.Featurebase.q = win.Featurebase.q || []).push(arguments);
      };
    }

    win.Featurebase("boot", {
      appId: "69ecac10fbb00ef1c7b64475",
      theme: "light",
      language: "en",
    });
  }, []);

  return (
    <Script
      src="https://do.featurebase.app/js/sdk.js"
      id="featurebase-sdk"
      strategy="afterInteractive"
    />
  );
};

export default FeaturebaseMessenger;
