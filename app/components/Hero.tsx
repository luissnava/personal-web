"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "../icons/icons";
export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.9s ease, transform 0.9s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center px-6 pt-24 pb-16 max-w-6xl mx-auto"
      aria-label="Presentación"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Columna izquierda — Texto */}
        <div>
          <p className="text-xs tracking-[0.3em] text-amber-400/70 uppercase mb-6 font-mono">
            Desarrollador de Software
          </p>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] text-white/95 mb-6">
            Luis
            <br />
            <span className="text-white/40">Hernandez</span>
            <br />
            Nava<span className="text-amber-400">.</span>
          </h1>

          <p className="text-base sm:text-lg text-white/50 leading-relaxed max-w-xl mb-12">
            Construyo aplicaciones web profesionales.
            Me especializo en React, Next.js y UI/UX.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="#proyectos"
              className="inline-flex items-center gap-2 bg-amber-400 text-[#0a0a0a] text-sm font-medium px-6 py-3 hover:bg-amber-300 transition-colors duration-300 rounded-sm tracking-wide"
            >
              Ver portafolio
              <ArrowRight />
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-300 tracking-wide group"
            >
              Hablemos
              <span className="w-6 h-px bg-white/30 group-hover:w-10 group-hover:bg-white/60 transition-all duration-300 inline-block" />
            </a>
          </div>
        </div>

        {/* Columna derecha — Imagen + cuadrados decorativos */}
        <div className="relative hidden lg:flex items-center justify-center h-120">
          <div className="absolute top-0 right-0 w-20 h-20 border border-white/10 bg-white/3" />
          <div className="absolute top-6 right-24 w-14 h-14 border border-white/6 bg-white/2" />
          <div className="absolute bottom-12 right-4 w-24 h-24 border border-white/10 bg-white/3" />
          <div className="absolute bottom-0 right-28 w-16 h-16 border border-white/6 bg-white/2" />
          <div className="absolute top-20 left-0 w-12 h-12 border border-white/6 bg-white/2" />
          <div className="absolute bottom-24 left-8 w-10 h-10 border border-amber-400/10 bg-amber-400/3" />

          {/* Grid decorativo central */}
          <div className="absolute top-16 right-8 w-40 h-40 opacity-20">
            <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-px">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="border border-white/20" />
              ))}
            </div>
          </div>

          {/* Placeholder imagen — reemplaza con tu foto/ilustración */}
          <div className="relative z-10 w-64 h-80 bg-linear-to-b from-white/6 to-white/2 border border-white/10 flex items-end justify-center overflow-hidden">
            <div className="text-center pb-6">
              <span className="text-xs font-mono text-white/20 tracking-widest uppercase">
                Tu foto aquí
              </span>
            </div>
          </div>

          <div className="absolute bottom-8 right-16 w-28 h-28 border border-white/8 bg-white/2 z-0" />
        </div>
      </div>

      {/* Línea decorativa izquierda */}
      <div className="absolute left-0 top-1/3 h-32 w-px bg-linear-to-b from-transparent via-amber-400/30 to-transparent hidden lg:block" />

      {/* Indicador scroll */}
      <div className="absolute bottom-10 left-6 flex items-center gap-3">
        <div className="w-px h-12 bg-linear-to-b from-white/20 to-transparent animate-pulse" />
        <span className="text-xs text-white/20 tracking-widest uppercase rotate-90 origin-left translate-y-4">
          Scroll
        </span>
      </div>

      {/* Fondo decorativo */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(251,191,36,0.04) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.02) 0%, transparent 40%)",
        }}
      />
    </section>
  );
}