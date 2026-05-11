import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const aboutLinks = [
  { to: "/about", label: "Our Story" },
  { to: "/about/team", label: "Our Team" },
  { to: "/about/mission-vision", label: "Mission & Vision" },
  { to: "/about/impact", label: "Our Impact" },
  { to: "/about/approach", label: "Our Approach" },
  { to: "/about/beneficiaries", label: "Our Beneficiaries" },
] as const;

const nav = [
  { to: "/", label: "Home" },
  { to: "/programs", label: "Programs" },
  { to: "/gallery", label: "Gallery" },
  { to: "/get-involved", label: "Get Involved" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 font-semibold tracking-tight">
          <img src={logo} alt="Uyisenga Ni Imanzi logo" className="h-11 w-auto" />
          <span className="hidden text-sm font-semibold uppercase tracking-wide text-foreground sm:inline">Uyisenga Ni Imanzi</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "rounded-md px-3 py-2 text-sm font-medium text-foreground bg-secondary" }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>

          {/* About dropdown */}
          <div className="group relative">
            <Link
              to="/about"
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground bg-secondary" }}
            >
              About <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            <div className="invisible absolute left-0 top-full z-50 w-56 translate-y-1 rounded-xl border border-border bg-popover p-1.5 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {aboutLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {nav.slice(1).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "rounded-md px-3 py-2 text-sm font-medium text-foreground bg-secondary" }}
            >
              {n.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-2">
            <Link to="/get-involved">Donate</Link>
          </Button>
        </nav>
        <button
          className="md:hidden rounded-md p-2 text-foreground hover:bg-secondary"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col p-4">
            <Link to="/" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary">Home</Link>
            <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">About</p>
            {aboutLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            {nav.slice(1).map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
