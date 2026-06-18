import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { SiteLayout } from "@/frontend/components/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Uyisenga Ni Imanzi (UNM)" },
      { name: "description", content: "Learn about UNM's story, team, mission, impact, approach and beneficiaries." },
      { property: "og:title", content: "About UNM" },
      { property: "og:description", content: "Our story, team, mission, impact and approach." },
    ],
  }),
  component: AboutLayout,
});

type Tab = { to: string; label: string; exact?: boolean };
const tabs: Tab[] = [
  { to: "/about", label: "Our Story", exact: true },
  { to: "/about/team", label: "Our Team" },
  { to: "/about/mission-vision", label: "Mission & Vision" },
  { to: "/about/impact", label: "Our Impact" },
  { to: "/about/approach", label: "Our Approach" },
  { to: "/about/beneficiaries", label: "Our Beneficiaries" },
];

function AboutLayout() {
  return (
    <SiteLayout>
      <div className="border-b border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="pt-10 text-sm font-medium uppercase tracking-wider text-primary">About us</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Get to know Uyisenga Ni Imanzi
          </h1>
          <nav className="mt-6 flex gap-1 overflow-x-auto pb-3">
            {tabs.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                activeOptions={{ exact: !!t.exact }}
                className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                activeProps={{ className: "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-primary bg-background shadow-sm" }}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <Outlet />
    </SiteLayout>
  );
}
