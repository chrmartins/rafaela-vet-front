"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WhatsappIcon } from "@/components/illustrations/icons";
import { montarLinkWhatsapp } from "@/lib/contato";
import { contatoSchema, type ContatoData } from "@/schema/contato-schema";

/**
 * Formulário interativo da página de Contato. Extraído em componente próprio
 * (com "use client") porque `app/contato/page.tsx` precisa continuar sendo
 * Server Component para exportar `metadata` — os dois não podem coexistir no
 * mesmo arquivo.
 */
export function ContatoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContatoData>({
    resolver: zodResolver(contatoSchema),
    mode: "onBlur",
  });

  function onSubmit(dados: ContatoData) {
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

    // Fica visível quando a pessoa volta do WhatsApp para o navegador — é o
    // único sinal de que o envio saiu daqui. Se o app não abrir (já aconteceu
    // no celular), o toast é o que evita a sensação de botão morto.
    toast.success("Abrindo o WhatsApp", {
      description: "Sua mensagem já vai preenchida. É só enviar.",
    });

    // Só executa dentro do handleSubmit em resposta a um envio de formulário
    // real, nunca durante o render — a regra não distingue esse caso.
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = url;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-lg border border-linha bg-creme p-6 shadow-cartao sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="nome">Nome completo</Label>
          <Input
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
          <Label htmlFor="telefone">Telefone / WhatsApp</Label>
          <Input
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
          <Label htmlFor="bairro">Bairro</Label>
          <Input
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
          <Label htmlFor="mensagem">
            Mensagem{" "}
            <span className="font-normal text-verde-500">(opcional)</span>
          </Label>
          <Textarea
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

      <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto">
        <WhatsappIcon className="h-5 w-5" />
        Enviar pelo WhatsApp
      </Button>

      <p className="mt-4 font-corpo text-xs leading-relaxed text-verde-500">
        Ao enviar, você abre uma conversa no WhatsApp com os dados preenchidos.
        Nenhuma informação é armazenada por este site.
      </p>
    </form>
  );
}
