import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-semibold text-foreground">Uyisenga Ni Imanzi</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            A Rwandan non-governmental organization supporting young people and communities
            through psychosocial care, education, and livelihoods.
          </p>
          <div className="mt-4 flex gap-3 text-muted-foreground">
            <a href="https://www.facebook.com/uyisenganimanzi" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-foreground"><Facebook className="h-5 w-5" /></a>
            <a href="https://www.instagram.com/uyisenganimanzi_/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-foreground"><Instagram className="h-5 w-5" /></a>
            <a href="https://x.com/UyisenganImanzi" target="_blank" rel="noreferrer" aria-label="X" className="hover:text-foreground"><Twitter className="h-5 w-5" /></a>
            <a href="https://www.linkedin.com/in/uyisenga-ni-imanzi-b8820a97/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-foreground"><Linkedin className="h-5 w-5" /></a>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/programs" className="hover:text-foreground">Programs</Link></li>
            <li><Link to="/gallery" className="hover:text-foreground">Gallery</Link></li>
            <li><Link to="/get-involved" className="hover:text-foreground">Press Room</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/admin" className="hover:text-foreground">Admin</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Kacyiru, KIGALI-RWANDA</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> <a href="tel:+250788729994" className="hover:text-foreground">0788 729 994</a></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> <a href="mailto:info@uyisenganimanzi.org.rw" className="hover:text-foreground">info@uyisenganimanzi.org.rw</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Uyisenga Ni Imanzi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
