import type { Metadata, Viewport } from "next";
import { Playfair_Display, Space_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://luisnava.dev"),
  title: {
    default: "Luis Hernandez Nava · Desarrollador Frontend",
    template: "%s | Luis Hernandez Nava",
  },
  description:
    "Desarrollador Frontend en React, Next.js y TypeScript. Construyo interfaces web, accesibles y con atención al detalle. +5 años de experiencia. Disponible para proyectos freelance en México.",
  keywords: [
    "desarrollador frontend",
    "desarrollador backend",
    "desarrollador fullstack",
    "desarrollador web",
    "desarrollador de software",
    "desarrollo web",
    "desarrollo de software",
    "software developer",
    "frontend developer",
    "fullstack developer",
    "web development",
    "software development",
    "programador",
    "ingeniero de software",
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Node.js",
    "HTML",
    "CSS",
    "Vite",
    "API REST",
    "inteligencia artificial",
    "IA",
    "AI",
    "Claude",
    "ChatGPT",
    "OpenAI",
    "Anthropic",
    "machine learning",
    "LLM",
    "prompt engineering",
    "automatización con IA",
    "AI integration",
    "AI developer",
    "Amazon Q",
    "página web",
    "web profesional",
    "Luis Hernandez Nava",
    "portafolio web",
    "freelance",
    "México",
  ],
  authors: [{ name: "Luis Hernandez Nava", url: "https://luisnava.dev" }],
  creator: "Luis Hernandez Nava",
  publisher: "Luis Hernandez Nava",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    title: "Luis Hernandez Nava · Desarrollador Frontend",
    description:
      "Desarrollador Frontend en React y Next.js. +5 años creando interfaces web, accesibles y con atención al detalle.",
    url: "https://luisnava.dev",
    siteName: "Luis Hernandez Nava",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luis Hernandez Nava · Desarrollador Frontend",
    description:
      "Desarrollador Frontend en React y Next.js. Disponible para proyectos freelance.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://luisnava.dev",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Luis Hernandez Nava",
  jobTitle: "Desarrollador Frontend",
  url: "https://luisnava.dev",
  sameAs: [
    "https://www.linkedin.com/in/luis-nava98/",
    "https://github.com/luissnava",
  ],
  knowsAbout: ["React", "Next.js", "TypeScript", "Tailwind CSS", "JavaScript", "Vite"],
  address: {
    "@type": "PostalAddress",
    addressCountry: "MX",
  },
  description:
    "Desarrollador Frontend con más de 5 años de experiencia en React, Next.js y TypeScript.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${spaceMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0a0a0a] text-white antialiased selection:bg-amber-400/20 selection:text-amber-200">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-amber-400 focus:text-[#0a0a0a] focus:text-sm focus:rounded-sm"
        >
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  );
}
