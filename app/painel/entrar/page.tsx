import type { Metadata } from "next";
import { Logo } from "@/components/logo/logo";
import { destinoSeguro } from "@/lib/sessao";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Entrar",
};

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ destino?: string }>;
}) {
  const { destino } = await searchParams;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-creme-200 px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo withTagline />
        </div>

        <div className="mt-8 rounded-lg border border-linha bg-creme p-6 shadow-cartao sm:p-8">
          <h1 className="font-titulo text-2xl text-verde-900">Acesso ao painel</h1>
          <p className="mt-2 font-corpo text-sm leading-relaxed text-verde-700">
            Área restrita. Use as credenciais fornecidas pela administração.
          </p>

          <div className="mt-6">
            {/* destinoSeguro barra open redirect: sem ele,
                ?destino=https://site-malicioso levaria a pessoa para fora
                logo após o login. */}
            <LoginForm destino={destinoSeguro(destino)} />
          </div>
        </div>
      </div>
    </div>
  );
}
