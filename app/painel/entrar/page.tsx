import type { Metadata } from "next";
import { Logo } from "@/components/logo/logo";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function EntrarPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-creme-200 px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo withTagline />
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-linha bg-creme p-6 shadow-cartao sm:p-8">
          <h1 className="font-titulo text-2xl text-verde-900">
            Acesso ao painel
          </h1>
          <p className="mt-2 font-corpo text-sm leading-relaxed text-verde-700">
            {/* TODO: formulário real + POST /api/sessoes (BFF) — próximo passo */}
            Formulário de acesso em construção.
          </p>
        </div>
      </div>
    </div>
  );
}
