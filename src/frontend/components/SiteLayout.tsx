import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { WhatsAppIcon } from "./WhatsAppIcon";

const WHATSAPP_LINK = "https://wa.me/250788729994";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp: +250 788 729 994"
        className="fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 font-semibold text-background shadow-[0_10px_30px_-8px_oklch(0.55_0.16_150/0.65)] transition hover:scale-105 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2"
      >
        <WhatsAppIcon className="h-6 w-6 shrink-0" />
        <span className="site-menu hidden text-xs sm:inline">Chat with us</span>
      </a>
    </div>
  );
}
