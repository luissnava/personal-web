import { WhatsAppIcon, ArrowUpRightIcon } from "../icons/icons";
import { contactLinks } from "../contants";

export default function Contact() {

  return (
    <section
      id="contacto"
      className="py-24 px-6 max-w-6xl mx-auto"
      aria-labelledby="contacto-heading"
    >
      {/* Divider */}
      {/* <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-24" /> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Texto */}
        <div>
          <span className="text-xs tracking-[0.3em] text-amber-400/70 uppercase font-mono mb-4 block">
            Contacto
          </span>
          <h2
            id="contacto-heading"
            className="font-serif text-3xl sm:text-4xl text-white/90 mb-6 leading-tight"
          >
            ¿Tienes un proyecto
            <br />
            <span className="text-white/40">en mente?</span>
          </h2>
          <p className="text-white/40 text-sm sm:text-base leading-relaxed max-w-sm">
            Estoy disponible para proyectos freelance, colaboraciones y
            oportunidades de trabajo. No dudes en escribirme.
          </p>

          <div className="mt-10">
            <a
              href="https://wa.me/525511421531"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-amber-400 text-[#0a0a0a] text-sm font-medium px-6 py-3 hover:bg-amber-300 transition-colors duration-300 rounded-sm tracking-wide"
            >
              <WhatsAppIcon />
              Envíame mensaje
            </a>
          </div>
        </div>

        {/* Links de contacto */}
        <div className="space-y-px bg-white/5 h-fit">
          {contactLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="flex items-center justify-between bg-[#0a0a0a] px-7 py-5 hover:bg-white/3 transition-colors duration-300 group"
              aria-label={`${item.label}: ${item.description}`}
            >
              <div>
                <p className="text-[11px] font-mono text-white/25 uppercase tracking-widest mb-1">
                  {item.label}
                </p>
                <p className="text-sm text-white/60 group-hover:text-white/90 transition-colors duration-300">
                  {item.value}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}


