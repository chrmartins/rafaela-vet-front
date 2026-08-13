"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Botao } from "@/components/ui/botao";
import { CampoTexto } from "@/components/ui/campo-texto";
import { AreaTexto } from "@/components/ui/area-texto";
import { Rotulo } from "@/components/ui/rotulo";
import { IconeWhatsapp } from "@/components/ilustracoes/icones";
import { contato, montarLinkWhatsapp } from "@/lib/contato";
import { esquemaContato, type DadosContato } from "@/schema/esquema-contato";

export function SecaoContato() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DadosContato>({
    resolver: zodResolver(esquemaContato),
    mode: "onBlur",
  });

  function aoEnviarFormulario(dados: DadosContato) {
    // -------------------------------------------------------------------------
    // INTEGRAÇÃO FUTURA — API de Agendamento
    // Ainda não há backend. Por enquanto o formulário apenas encaminha o
    // contato para o WhatsApp da Dra. Rafaela com a mensagem pré-preenchida.
    //
    // Quando a API existir (domínio `agendamento`, ver CLAUDE.md), trocar o
    // bloco abaixo por uma chamada REST, algo como:
    //   await agendamentoService.solicitarConsulta(dados)
    // mantendo `dados` (nome, telefone, bairro, mensagem) como payload e
    // tratando erro com o padrão de mensagens do projeto.
    // -------------------------------------------------------------------------
    const linhas = [
      "Olá, Dra. Rafaela! Gostaria de agendar uma visita.",
      "",
      `Nome: ${dados.nome}`,
      `Telefone: ${dados.telefone}`,
      `Bairro: ${dados.bairro}`,
    ];
    if (dados.mensagem?.trim()) {
      linhas.push(`Mensagem: ${dados.mensagem.trim()}`);
    }

    // Navegação direta (não window.open): o handleSubmit do React Hook Form
    // aguarda a validação do Zod antes de chamar esta função, o que quebra a
    // cadeia de gesto do usuário — Safari/Chrome no celular bloqueiam
    // window.open() como pop-up nesse caso. location.href não é bloqueado.
    const url = montarLinkWhatsapp(linhas.join("\n"));
    window.location.href = url;
  }

  return (
    <section id="contato" className="bg-creme-200 py-20 sm:py-28">
      <div className="mx-auto grid max-w-conteudo gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <p className="font-corpo text-sm font-medium uppercase tracking-[0.18em] text-verde-500">
            Contato
          </p>
          <h2 className="mt-4 font-titulo text-titulo-md text-verde-900">
            Vamos agendar a visita?
          </h2>
          <p className="mt-4 font-corpo text-lg leading-relaxed text-verde-700">
            Preencha os dados abaixo. Ao enviar, abrimos uma conversa no WhatsApp
            com tudo já preenchido — é só confirmar o melhor horário.
          </p>

          <a
            href={`tel:+${contato.whatsappNumero}`}
            className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-linha bg-creme px-5 py-4 font-corpo text-verde-800 shadow-cartao transition-colors hover:bg-verde-100"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-verde-100 text-verde-600">
              <IconeWhatsapp className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-xs text-verde-500">
                Prefere ligar ou chamar direto?
              </span>
              <span className="font-semibold">{contato.telefoneExibicao}</span>
            </span>
          </a>
        </div>

        <form
          onSubmit={handleSubmit(aoEnviarFormulario)}
          noValidate
          className="rounded-[1.75rem] border border-linha bg-creme p-6 shadow-cartao sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Rotulo htmlFor="nome">Nome completo</Rotulo>
              <CampoTexto
                id="nome"
                autoComplete="name"
                placeholder="Como podemos te chamar?"
                aria-invalid={!!errors.nome}
                aria-describedby={errors.nome ? "erro-nome" : undefined}
                {...register("nome")}
              />
              {errors.nome && (
                <p id="erro-nome" className="text-sm text-red-600">
                  {errors.nome.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Rotulo htmlFor="telefone">Telefone / WhatsApp</Rotulo>
              <CampoTexto
                id="telefone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(21) 90000-0000"
                aria-invalid={!!errors.telefone}
                aria-describedby={errors.telefone ? "erro-telefone" : undefined}
                {...register("telefone")}
              />
              {errors.telefone && (
                <p id="erro-telefone" className="text-sm text-red-600">
                  {errors.telefone.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Rotulo htmlFor="bairro">Bairro</Rotulo>
              <CampoTexto
                id="bairro"
                autoComplete="address-level3"
                placeholder="Onde seu pet está?"
                aria-invalid={!!errors.bairro}
                aria-describedby={errors.bairro ? "erro-bairro" : undefined}
                {...register("bairro")}
              />
              {errors.bairro && (
                <p id="erro-bairro" className="text-sm text-red-600">
                  {errors.bairro.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Rotulo htmlFor="mensagem">
                Mensagem{" "}
                <span className="font-normal text-verde-500">(opcional)</span>
              </Rotulo>
              <AreaTexto
                id="mensagem"
                placeholder="Conte um pouco sobre seu pet e o que precisa."
                aria-invalid={!!errors.mensagem}
                aria-describedby={errors.mensagem ? "erro-mensagem" : undefined}
                {...register("mensagem")}
              />
              {errors.mensagem && (
                <p id="erro-mensagem" className="text-sm text-red-600">
                  {errors.mensagem.message}
                </p>
              )}
            </div>
          </div>

          <Botao type="submit" tamanho="grande" className="mt-6 w-full sm:w-auto">
            <IconeWhatsapp className="h-5 w-5" />
            Enviar pelo WhatsApp
          </Botao>

          <p className="mt-4 font-corpo text-xs leading-relaxed text-verde-500">
            Ao enviar, você abre uma conversa no WhatsApp com os dados
            preenchidos. Nenhuma informação é armazenada por este site.
          </p>
        </form>
      </div>
    </section>
  );
}
