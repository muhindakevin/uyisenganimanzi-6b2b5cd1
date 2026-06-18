import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import logo from "@/frontend/assets/logo.png";

const aboutLinks = [
  { to: "/about", label: "Our Story" },
  { to: "/about/team", label: "Our Team" },
  { to: "/about/mission-vision", label: "Mission & Vision" },
  { to: "/about/impact", label: "Our Impact" },
  { to: "/about/approach", label: "Our Approach" },
  { to: "/about/beneficiaries", label: "Our Beneficiaries" },
] as const;

const pressRoomLinks = [
  { to: "/press-room/news", label: "News Stories" },
  { to: "/press-room/publications", label: "Publications & Reports" },
  { to: "/press-room/jobs", label: "Jobs and Tenders" },
] as const;

const nav = [
  { to: "/programs", label: "Programs" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

const linkBase = "rounded-md px-3 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white";
const linkActive = "rounded-md px-3 py-2 text-sm font-semibold text-white bg-white/15";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [pressRoomOpen, setPressRoomOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-[oklch(0.28_0.12_260)] via-primary to-primary-glow shadow-[0_8px_24px_-12px_oklch(0.13_0.02_260/0.5)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 font-semibold tracking-tight text-white">
          <img src={logo} alt="Uyisenga Ni Imanzi logo" className="h-11 w-auto rounded-md bg-white/95 p-1" />
          <span className="hidden text-sm font-semibold uppercase tracking-wide sm:inline">Uyisenga Ni Imanzi</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/" className={linkBase} activeProps={{ className: linkActive }} activeOptions={{ exact: true }}>
            Home
          </Link>

          <div className="group relative">
            <Link to="/about" className={`flex items-center gap-1 ${linkBase}`} activeProps={{ className: `flex items-center gap-1 ${linkActive}` }}>
              About <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            <div className="invisible absolute left-0 top-full z-50 w-56 translate-y-1 rounded-xl border border-border bg-popover p-1.5 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {aboutLinks.map((l) => (
                <Link key={l.to} to={l.to} className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/programs" className={linkBase} activeProps={{ className: linkActive }}>Programs</Link>
          <Link to="/gallery" className={linkBase} activeProps={{ className: linkActive }}>Gallery</Link>

          <div className="group relative">
            <Link to="/get-involved" className={`flex items-center gap-1 ${linkBase}`} activeProps={{ className: `flex items-center gap-1 ${linkActive}` }}>
              Press Room <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            <div className="invisible absolute left-0 top-full z-50 w-56 translate-y-1 rounded-xl border border-border bg-popover p-1.5 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {pressRoomLinks.map((l) => (
                <Link key={l.to} to={l.to} className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/contact" className={linkBase} activeProps={{ className: linkActive }}>Contact</Link>

          <Button asChild size="sm" variant="secondary" className="ml-2 font-semibold shadow-md">
            <Link to="/donate">Donate</Link>
          </Button>
        </nav>
        <button
          className="md:hidden rounded-md p-2 text-white hover:bg-white/10"
          onClick={() => setOpen((prev) => {
            if (prev) {
              setAboutOpen(false);
              setPressRoomOpen(false);
            }
            return !prev;
          })}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-[oklch(0.18_0.05_260)] md:hidden">
          <nav className="mx-auto max-w-6xl p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="space-y-2">
              <Link to="/" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Home
              </Link>

              <button
                type="button"
                onClick={() => setAboutOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl bg-white/10 px-3 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <span>About</span>
                <ChevronDown className={"h-4 w-4 transition-transform " + (aboutOpen ? "rotate-180" : "")} />
              </button>
              <div className={"overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all " + (aboutOpen ? "max-h-96" : "max-h-0")}>
                <div className="space-y-1 overflow-y-auto px-2 py-2 text-sm text-white" style={{ maxHeight: "20rem" }}>
                  {aboutLinks.map((l) => (
                    <Link key={l.to} to={l.to} onClick={() => { setOpen(false); setAboutOpen(false); }} className="block rounded-lg px-3 py-2 transition hover:bg-white/10">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>

              {nav.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  {n.label}
                </Link>
              ))}

              <button
                type="button"
                onClick={() => setPressRoomOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl bg-white/10 px-3 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <span>Press Room</span>
                <ChevronDown className={"h-4 w-4 transition-transform " + (pressRoomOpen ? "rotate-180" : "")} />
              </button>
              <div className={"overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all " + (pressRoomOpen ? "max-h-72" : "max-h-0")}>
                <div className="space-y-1 overflow-y-auto px-2 py-2 text-sm text-white" style={{ maxHeight: "16rem" }}>
                  {pressRoomLinks.map((l) => (
                    <Link key={l.to} to={l.to} onClick={() => { setOpen(false); setPressRoomOpen(false); }} className="block rounded-lg px-3 py-2 transition hover:bg-white/10">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Button asChild size="sm" variant="secondary" className="w-full mt-2">
                <Link to="/donate" onClick={() => setOpen(false)}>Donate</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
