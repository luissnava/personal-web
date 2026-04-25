export default function Skills() {
  const categories = [
    {
      title: "Core",
      skills: ["HTML5", "CSS3", "JavaScript (ES15)", "TypeScript"],
    },
    {
      title: "Frameworks & Librerías",
      skills: ["React", "Next.js", "React Native", "Nodejs", "Express",]
    },
    {
      title: "Estilos & UI",
      skills: ["Tailwind CSS", "CSS Modules", "Style Components", "Components Library", "GSAP Animaciones"],
    },
    {
      title: "Tooling",
      skills: ["Vite", "ESLint", "Prettier"],
    },
    {
      title: "Testing",
      skills: ["Vitest", "Playwright", "Storybook"],
    },
    {
      title: "Otras herramientas",
      skills: ["Git", "Docker", "Postman"],
    },
  ];

  return (
    <section
      id="habilidades"
      className="py-24 px-6 max-w-6xl mx-auto"
      aria-labelledby="habilidades-heading"
    >
      <div className="mb-14">
        <span className="text-xs tracking-[0.3em] text-amber-400/70 uppercase font-mono mb-4 block">
          Stack técnico
        </span>
        <h2
          id="habilidades-heading"
          className="font-serif text-3xl sm:text-4xl text-white/90 leading-tight"
        >
          Tecnologias con las
          <br />
          <span className="text-white/40">que trabajo cada día</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
        {categories.map((item, index) => (
          <div
            key={index}
            className="bg-[#0a0a0a] p-7 hover:bg-white/2 transition-colors duration-300 group"
          >
            <p className="text-xs tracking-widest text-amber-400/50 uppercase font-mono mb-4">
              {item.title}
            </p>
            <ul className="space-y-2" aria-label={`Habilidades en ${item.title}`}>
              {item.skills.map((skill) => (
                <li
                  key={skill}
                  className="text-sm text-white/50 group-hover:text-white/60 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-amber-400/30 shrink-0" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
