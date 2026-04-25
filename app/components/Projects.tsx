"use client";
import { useState } from "react";
import Image from "next/image";
import { projects } from "../contants";
import { ExternalLinkIcon, ChevronLeft, ChevronRight } from "../icons/icons";

function getSlideStyle(index: number, active: number, total: number) {
  const offset = index - active;
  const absOffset = Math.abs(offset);
  const isActive = offset === 0;
  return { offset, absOffset, isActive, total };
}

export default function Projects() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((item) => (item - 1 + projects.length) % projects.length);
  const next = () => setActive((item) => (item + 1) % projects.length);

  return (
    <section
      id="proyectos"
      className="py-24 px-6 max-w-6xl mx-auto"
      aria-labelledby="proyectos-heading"
    >
      <div className="mb-14">
        <span className="text-xs tracking-[0.3em] text-amber-400/70 uppercase font-mono mb-4 block">
          Portafolio
        </span>
        <h2
          id="proyectos-heading"
          className="font-serif text-3xl sm:text-4xl text-white/90 leading-tight"
        >
          Proyectos seleccionados<span className="text-amber-400">.</span>
        </h2>
      </div>

      {/* Carrusel 3D */}
      <div className="relative overflow-hidden" style={{ perspective: "1200px" }}>
        <div className="flex items-center justify-center min-h-120 pointer-events-none">
          {projects.map((project, item) => {
            const { offset, absOffset, isActive } = getSlideStyle(item, active, projects.length);

            return (
              <article
                key={project.id}
                onClick={() => setActive(item)}
                className="absolute w-[90%] max-w-lg cursor-pointer"
                style={{
                  transform: `
                    translateX(${offset * 60}%)
                    translateZ(${isActive ? 0 : -250}px)
                    rotateY(${offset * -15}deg)
                    scale(${isActive ? 1 : 0.85})
                  `,
                  opacity: absOffset > 1 ? 0 : 1,
                  zIndex: projects.length - absOffset,
                  transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: absOffset > 1 ? "none" : "auto",
                  filter: isActive ? "none" : "brightness(0.5)",
                }}
                role="group"
                aria-roledescription="slide"
              >
                <div
                  className={`border rounded-sm overflow-hidden ${isActive
                    ? "border-amber-400/30 bg-[#141414]"
                    : "border-white/10 bg-[#111111]"
                    }`}
                >
                  {/* Imagen */}
                  {project.image && (
                    <div className="relative w-full h-64 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 512px) 90vw, 512px"
                        className="object-cover object-top"
                      />
                    </div>
                  )}

                  {/* Contenido */}
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-serif text-xl text-white/90">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="text-[10px] tracking-widest uppercase font-mono text-amber-400/70 border border-amber-400/20 px-2 py-0.5">
                          Destacado
                        </span>
                      )}
                    </div>

                    {/* <p className="text-sm text-white/40 leading-relaxed mb-4">
                      {project.description}
                    </p> */}

                    <ul className="flex flex-wrap gap-2 mb-4" aria-label="Tecnologías">
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="text-[11px] font-mono text-white/30 border border-white/10 px-2 py-0.5 rounded-sm"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/25 hover:text-amber-400 transition-colors"
                        aria-label={`Ver demo de ${project.title}`}
                      >
                        <ExternalLinkIcon />
                      </a>
                      {project.comment && (
                        <span className="text-[10px] font-mono text-white/20 italic">
                          {project.comment}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Controles */}
        <div className="relative z-10 flex justify-center gap-4 mt-8 pointer-events-auto">
          <button
            onClick={prev}
            className="w-10 h-10 cursor-pointer border border-white/10 text-white/40 hover:text-amber-400 hover:border-amber-400/30 transition-colors flex items-center justify-center rounded-sm"
            aria-label="Proyecto anterior"
          >
            <ChevronLeft />
          </button>

          <div className="flex items-center gap-2">
            {projects.map((_, item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`h-1.5 rounded-full transition-all duration-300 ${item === active
                  ? "w-6 bg-amber-400"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                aria-label={`Ir al proyecto ${item + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10  cursor-pointer border border-white/10 text-white/40 hover:text-amber-400 hover:border-amber-400/30 transition-colors flex items-center justify-center rounded-sm"
            aria-label="Proyecto siguiente"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
