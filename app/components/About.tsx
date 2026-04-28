import { LinkedInIcon } from "../icons/icons";
import { experience } from "../contants";

export default function About() {
  return (
    <section
      id="sobre-mi"
      className="py-24 px-6 max-w-6xl mx-auto"
      aria-labelledby="sobre-mi-heading"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Texto */}
        <div>
          <span className="text-xs tracking-[0.3em] text-amber-400/70 uppercase font-mono mb-4 block">
            Sobre mí
          </span>
          <h2
            id="sobre-mi-heading"
            className="font-serif text-3xl sm:text-4xl text-white/90 mb-6 leading-tight"
          >
            Código limpio,
            <br />
            <span className="text-white/40">experiencias memorables</span>
          </h2>
          <div className="space-y-4 text-white/50 leading-relaxed text-sm sm:text-base">
            <p>
              Soy desarrollador de software apasionado por construir aplicaciones
              de alto rendimiento con diseño profesional. Mi
              enfoque está en React, Next.js y la web moderna.
            </p>
            <p>
              Disfruto cada etapa del proceso: desde la arquitectura de componentes
              reutilizables hasta afinar la interaccón de usuario.
              Para mí, el detalle importa.
            </p>
          </div>

          <div className="mt-8">
            <a
              href="https://www.linkedin.com/in/luis-nava98/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-amber-400/80 hover:text-amber-400 transition-colors group"
              aria-label="Ver perfil de LinkedIn de Pedro Hernandez (abre en nueva pestaña)"
            >
              <LinkedInIcon />
              Ver perfil en LinkedIn
              <span className="w-4 h-px bg-amber-400/40 group-hover:w-8 group-hover:bg-amber-400 transition-all duration-300" />
            </a>
          </div>
        </div>

        {/* Experiencía */}
        <div className="grid grid-cols-1 gap-px bg-white/5 border border-white/5 rounded-sm overflow-hidden">
          {experience.map((stat, i) => (
            <div
              key={i}
              className="bg-[#0a0a0a] px-8 py-7 flex items-center justify-between group hover:bg-white/2 transition-colors duration-300"
            >
              <span className="text-white/40 text-sm">{stat.label}</span>
              <span className="font-serif text-3xl text-white/90 group-hover:text-amber-400 transition-colors duration-300">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

