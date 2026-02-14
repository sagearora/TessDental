"use client"

import Script from "next/script"

export function TallyScript() {
  return (
    <Script
      src="https://tally.so/widgets/embed.js"
      strategy="lazyOnload"
      onLoad={() => {
        if (typeof window !== "undefined" && (window as any).Tally) {
          (window as any).Tally.loadEmbeds();
        }
      }}
    />
  )
}
