import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "RaiWell AI — AI Layer for Wellness Tourism",
  description:
    "RaiWell AI designs personalized Chiang Rai wellness journeys with AI planning, local provider matching, daily adaptation, and coach review.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-gradient-to-b from-white via-wellness-50/40 to-white text-wellness-900 antialiased">
        <header className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b border-wellness-100">
          <div className="mx-auto max-w-6xl px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-wellness-500 to-wellness-700 text-white font-bold shadow-soft">R</span>
              <div className="leading-tight">
                <div className="font-semibold tracking-tight">RaiWell <span className="text-wellness-600">AI</span></div>
                <div className="hidden sm:block text-[10px] text-wellness-700/70 -mt-0.5">AI Layer for Thailand Wellness</div>
              </div>
            </Link>
            <nav className="flex items-center gap-1 text-sm overflow-x-auto no-scrollbar">
              <Link href="/intake" className="px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-wellness-50 text-wellness-800 whitespace-nowrap">Intake</Link>
              <Link href="/plan" className="px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-wellness-50 text-wellness-800 whitespace-nowrap">Plan</Link>
              <Link href="/demo" className="px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-wellness-50 text-wellness-800 whitespace-nowrap">Demo</Link>
              <Link href="/intake" className="ml-1 btn-primary !py-1.5 !px-3.5 text-xs sm:text-sm">Start</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 sm:px-5 py-6 sm:py-8">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 sm:px-5 py-10 text-xs text-wellness-700/70">
          <p className="rounded-xl bg-wellness-50 border border-wellness-100 p-4 leading-relaxed">
            <strong className="text-wellness-800">Disclaimer:</strong> RaiWell AI is not a medical diagnosis tool.
            It supports general lifestyle and wellness planning only. Users with medical symptoms should consult
            qualified healthcare professionals.
          </p>
          <p className="mt-3 text-center">© RaiWell AI · Chiang Rai pilot · built for Thailand wellness tourism</p>
        </footer>
      </body>
    </html>
  );
}
