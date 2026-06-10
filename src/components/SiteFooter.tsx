import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-gradient-to-br from-[oklch(0.20_0.08_260)] via-[oklch(0.25_0.10_260)] to-[oklch(0.32_0.14_260)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-semibold">Uyisenga Ni Imanzi</p>
          <p className="mt-2 max-w-md text-sm text-white/75">
            A Rwandan non-governmental organization supporting young people and communities
            through psychosocial care, education, and livelihoods.
          </p>
          <div className="mt-5 flex gap-3 text-white/80">
            <a href="https://www.facebook.com/uyisenganimanzi" target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full bg-white/10 p-2 hover:bg-white/20"><Facebook className="h-4 w-4" /></a>
            <a href="https://www.instagram.com/uyisenganimanzi_/" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full bg-white/10 p-2 hover:bg-white/20"><Instagram className="h-4 w-4" /></a>
            <a href="https://x.com/UyisenganImanzi" target="_blank" rel="noreferrer" aria-label="X" className="rounded-full bg-white/10 p-2 hover:bg-white/20"><Twitter className="h-4 w-4" /></a>
            <a href="https://www.linkedin.com/in/uyisenga-ni-imanzi-b8820a97/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full bg-white/10 p-2 hover:bg-white/20"><Linkedin className="h-4 w-4" /></a>
          </div>
          <Button asChild size="sm" variant="secondary" className="mt-5 font-semibold">
            <Link to="/donate"><Heart className="mr-1.5 h-4 w-4" /> Donate now</Link>
          </Button>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/90">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/programs" className="hover:text-white">Programs</Link></li>
            <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
            <li><Link to="/get-involved" className="hover:text-white">Press Room</Link></li>
            <li><Link to="/donate" className="hover:text-white">Donate</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/admin" className="hover:text-white">Admin</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/90">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Kacyiru, KIGALI-RWANDA</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> <a href="tel:+250788729994" className="hover:text-white">0788 729 994</a></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> <a href="mailto:info@uyisenganimanzi.org.rw" className="hover:text-white">info@uyisenganimanzi.org.rw</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/60 sm:px-6">
          © {new Date().getFullYear()} Uyisenga Ni Imanzi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
