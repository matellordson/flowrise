"use client";

import { useEffect } from "react";

export default function BTCChartDark() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://widgets.coingecko.com/gecko-coin-price-chart-widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
          <gecko-coin-price-chart-widget
            coin-id="usd-coin"
            currency="usd"
            locale="en"
            dark-mode="true"
            transparent-background="true"
            style="width: 100%; height: 400px;"
          ></gecko-coin-price-chart-widget>
        `,
      }}
    />
  );
}

export function BTCChartLight() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://widgets.coingecko.com/gecko-coin-price-chart-widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
          <gecko-coin-price-chart-widget
            coin-id="usd-coin"
            currency="usd"
            locale="en"
            dark-mode="false"
            transparent-background="true"
            style="width: 100%; height: 400px;"
          ></gecko-coin-price-chart-widget>
        `,
      }}
    />
  );
}
