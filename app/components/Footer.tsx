"use client";

import { navLinks, socialLinks } from "../contants";
import { LinkedInIcon, MailIcon, GitHubIcon } from "../icons/icons";

const iconMap: Record<string, React.ReactNode> = {
  LinkedIn: <LinkedInIcon />,
  GitHub: <GitHubIcon />,
  Email: <MailIcon />,
};

export default function Footer() {
  const year = new Date().getFullYear();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-white/5 px-6 pt-16 pb-8 max-w-6xl mx-auto" role="contentinfo">
      {/* Línea decorativa amber */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-linear-to-r from-transparent via-amber-400/40 to-transparent" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-14">
        {/* Branding */}
        <div>
          <p className="font-serif text-xl text-white/90 mb-2">
            Luis Hernández Nava<span className="text-amber-400">.</span>
          </p>
          <p className="text-xs text-white/30 leading-relaxed max-w-50">
            Aplicaciones web profesionales.
          </p>
        </div>

        {/* Navegación */}
        <nav aria-label="Navegación del footer">
          <p className="text-[10px] tracking-[0.3em] text-amber-400/60 uppercase font-mono mb-4">
            Navegación
          </p>
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-white/30 hover:text-white/70 transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social */}
        <div>
          <p className="text-[10px] tracking-[0.3em] text-amber-400/60 uppercase font-mono mb-4">
            Conecta
          </p>
          <ul className="flex gap-3">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="w-9 h-9 border border-white/10 text-white/30 hover:text-amber-400 hover:border-amber-400/30 transition-all duration-300 flex items-center justify-center rounded-sm"
                  aria-label={`${link.label} (abre en nueva pestaña)`}
                >
                  {iconMap[link.label]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[11px] text-white/15 font-mono">
          © {year} Luis Hernandez Nava
        </p>

        <button
          onClick={scrollToTop}
          className="group flex items-center gap-2 text-[11px] cursor-pointer text-white/20 hover:text-amber-400/70 transition-colors duration-300 font-mono"
          aria-label="Volver al inicio"
        >
          Volver al inicio
          <span className="w-5 h-5 border border-white/10 group-hover:border-amber-400/30 flex items-center justify-center rounded-sm transition-all duration-300 group-hover:-translate-y-0.5">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 8V2M2.5 4.5L5 2l2.5 2.5" />
            </svg>
          </span>
        </button>
      </div>
    </footer>
  );
}

