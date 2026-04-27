"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { navLinks } from "../contants";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo / Nombre */}
        <a
          href="#hero"
          className="flex items-center gap-2 font-serif text-lg tracking-tight text-white/90 hover:text-white transition-colors"
        >
          <Image src="/logo.svg" alt="Logo de Luis Hernandez Nava" width={42} height={42} priority />
          
        </a>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/50 hover:text-white transition-colors duration-300 tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Hamburger mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span className={`block w-5 h-px bg-white/70 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-px bg-white/70 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-white/70 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-6 pb-6 flex flex-col gap-4"
          aria-label="Menú móvil"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-white/60 hover:text-white transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
