import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  { to: "/contact", label: "UNM CLINIC" },
] as const;

const linkBase = "rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/85 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground";
const linkActive = "rounded-md px-3 py-2 text-sm font-semibold text-primary-foreground bg-primary-foreground/15";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [pressRoomOpen, setPressRoomOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [programs, setPrograms] = useState<{ id: number; title: string }[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/programs", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() : [])
      .then((data) => { if (Array.isArray(data)) setPrograms(data); })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return (
    <header className="sticky top-0 z-50 border-b border-primary-foreground/10 bg-gradient-to-r from-brand-header via-primary to-primary-glow shadow-[var(--shadow-header)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" aria-label="Uyisenga Ni Imanzi homepage" onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }} className="flex min-w-0 items-center gap-2 font-semibold tracking-tight text-primary-foreground sm:gap-3">
          <img src={logo} alt="Uyisenga Ni Imanzi logo" className="h-14 w-auto shrink-0 rounded-md bg-card p-1 sm:h-[60px]" />
        </Link>
        <nav aria-label="Main menu" className="site-menu hidden items-center gap-1 md:flex">
          <div className="group relative">
            <Link to="/about" className={`flex items-center gap-1 ${linkBase}`} activeProps={{ className: `flex items-center gap-1 ${linkActive}` }}>
              WHO WE ARE <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            <div className="invisible absolute left-0 top-full z-50 w-56 translate-y-1 rounded-xl border border-border bg-popover p-1.5 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {aboutLinks.map((l) => (
                <Link key={l.to} to={l.to} className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="group relative">
            <Button type="button" variant="ghost" onClick={() => setProgramsOpen((value) => !value)} aria-expanded={programsOpen} aria-controls="desktop-programs-menu" className={`flex items-center gap-1 ${linkBase}`}>
              WHAT WE DO <ChevronDown className="h-3.5 w-3.5" />
            </Button>
            <div id="desktop-programs-menu" className={`absolute left-0 top-full z-50 max-h-80 w-64 overflow-y-auto rounded-xl border border-border bg-popover p-1.5 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 ${programsOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0"}`}>
              <Link to="/programs" onClick={() => setProgramsOpen(false)} className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary">All Programs</Link>
              {programs.map((program) => (
                <Link key={program.id} to="/programs/$id" params={{ id: String(program.id) }} onClick={() => setProgramsOpen(false)} className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary">{program.title}</Link>
              ))}
            </div>
          </div>

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

          <Link to="/contact" className={linkBase} activeProps={{ className: linkActive }}>UNM CLINIC</Link>

          <Button asChild size="sm" variant="secondary" className="ml-2 font-semibold shadow-md">
            <Link to="/donate">Donate</Link>
          </Button>
        </nav>
        <button
          className="md:hidden rounded-md p-2 text-primary-foreground hover:bg-primary-foreground/10"
          onClick={() => setOpen((prev) => {
            if (prev) {
              setAboutOpen(false);
              setProgramsOpen(false);
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
        <div className="border-t border-primary-foreground/10 bg-brand-header md:hidden">
          <nav aria-label="Main menu" className="site-menu mx-auto max-w-6xl p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setAboutOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl bg-primary-foreground/10 px-3 py-3 text-left text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/15"
              >
                <span>WHO WE ARE</span>
                <ChevronDown className={"h-4 w-4 transition-transform " + (aboutOpen ? "rotate-180" : "")} />
              </button>
              <div className={"overflow-hidden rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 transition-all " + (aboutOpen ? "max-h-96" : "max-h-0")}>
                <div className="space-y-1 overflow-y-auto px-2 py-2 text-sm text-primary-foreground" style={{ maxHeight: "20rem" }}>
                  {aboutLinks.map((l) => (
                    <Link key={l.to} to={l.to} onClick={() => { setOpen(false); setAboutOpen(false); }} className="block rounded-lg px-3 py-2 transition hover:bg-primary-foreground/10">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Button type="button" variant="ghost" onClick={() => setProgramsOpen((value) => !value)} aria-expanded={programsOpen} aria-controls="mobile-programs-menu" className="flex h-auto w-full items-center justify-between rounded-xl bg-primary-foreground/10 px-3 py-3 text-left text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground">
                WHAT WE DO <ChevronDown className={`h-4 w-4 transition-transform ${programsOpen ? "rotate-180" : ""}`} />
              </Button>
              {programsOpen && (
                <div id="mobile-programs-menu" className="max-h-80 space-y-1 overflow-y-auto rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-2 text-sm text-primary-foreground">
                  <Link to="/programs" onClick={() => { setOpen(false); setProgramsOpen(false); }} className="block rounded-lg px-3 py-2 hover:bg-primary-foreground/10">All Programs</Link>
                  {programs.map((program) => (
                    <Link key={program.id} to="/programs/$id" params={{ id: String(program.id) }} onClick={() => { setOpen(false); setProgramsOpen(false); }} className="block rounded-lg px-3 py-2 hover:bg-primary-foreground/10">{program.title}</Link>
                  ))}
                </div>
              )}

              {nav.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10">
                  {n.label}
                </Link>
              ))}

              <button
                type="button"
                onClick={() => setPressRoomOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl bg-primary-foreground/10 px-3 py-3 text-left text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/15"
              >
                <span>Press Room</span>
                <ChevronDown className={"h-4 w-4 transition-transform " + (pressRoomOpen ? "rotate-180" : "")} />
              </button>
              <div className={"overflow-hidden rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 transition-all " + (pressRoomOpen ? "max-h-72" : "max-h-0")}>
                <div className="space-y-1 overflow-y-auto px-2 py-2 text-sm text-primary-foreground" style={{ maxHeight: "16rem" }}>
                  {pressRoomLinks.map((l) => (
                    <Link key={l.to} to={l.to} onClick={() => { setOpen(false); setPressRoomOpen(false); }} className="block rounded-lg px-3 py-2 transition hover:bg-primary-foreground/10">
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
