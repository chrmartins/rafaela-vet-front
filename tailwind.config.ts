import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta da marca — verde-sálvia sobre creme (ver CLAUDE.md)
        verde: {
          900: "#2E3A26", // texto principal
          700: "#3E4E33",
          600: "#4F6142", // verde primário
          500: "#6E8659", // verde médio
          400: "#8AA274",
          300: "#A8BB95", // accent / verde claro
          200: "#C7D4B8",
          100: "#E3EAD9",
        },
        creme: {
          DEFAULT: "#FBF9F1", // fundo base
          200: "#F6F2E4", // fundo alternado
          300: "#EFE9D6",
        },
        // Cor das linhas/traços — ecoa o traço único do logo
        linha: "#DCE0CE",
      },
      fontFamily: {
        titulo: ["var(--fonte-titulo)", "Georgia", "serif"],
        corpo: ["var(--fonte-corpo)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "titulo-lg": [
          "clamp(2.75rem, 6vw, 4.75rem)",
          { lineHeight: "1.02", letterSpacing: "-0.02em" },
        ],
        "titulo-md": [
          "clamp(2rem, 4vw, 3rem)",
          { lineHeight: "1.08", letterSpacing: "-0.015em" },
        ],
      },
      maxWidth: {
        conteudo: "72rem",
      },
      boxShadow: {
        cartao: "0 1px 2px rgba(46,58,38,0.04), 0 12px 32px -12px rgba(46,58,38,0.18)",
        flutuante: "0 8px 40px -12px rgba(46,58,38,0.28)",
      },
      keyframes: {
        "surgir-suave": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "surgir-suave": "surgir-suave 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
