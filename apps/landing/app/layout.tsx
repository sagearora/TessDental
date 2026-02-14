// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { TallyScript } from "./components/TallyScript";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TallyScript />
        {children}
      </body>
    </html>
  );
}
