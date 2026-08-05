import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteFooter } from "@/components/site/site-footer";
import { socials } from "@/lib/portfolio-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contacto — SAID" },
      {
        name: "description",
        content:
          "Cuéntame qué estás construyendo. Said: AI, automatización, sistemas e interfaces.",
      },
      { property: "og:title", content: "Contacto — SAID" },
      {
        property: "og:description",
        content:
          "Cuéntame qué estás construyendo: AI, automatización, sistemas e interfaces.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const intents = [
  "Un producto",
  "Un sistema con AI",
  "Una automatización",
  "Algo sin definir",
];

function ContactPage() {
  const [intent, setIntent] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (!form.get("name") || !form.get("email") || !form.get("message")) {
      toast.error("Tres campos. Los tres importan.");
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success("Recibido. Lo leo todo.");
    }, 900);
  };

  return (
    <main>
      <header className="shell pb-[8vh] pt-[22vh]">
        <p className="label">ÍNDICE — 04</p>
        <h1 className="mt-6 text-display font-medium" data-reveal="mask">
          CONSTRUYAMOS
          <br />
          ALGO<span className="text-accent">.</span>
        </h1>
      </header>

      <section className="shell hairline-t py-[10vh]">
        <div className="grid grid-cols-12 gap-y-12">
          <div className="col-span-12 md:col-span-4">
            <p className="label">¿QUÉ ESTÁS CONSTRUYENDO?</p>
            <ul className="mt-6">
              {intents.map((it) => {
                const active = intent === it;
                return (
                  <li key={it} className="hairline-b">
                    <button
                      data-cursor="link"
                      onClick={() => setIntent(it)}
                      className="group flex w-full items-center justify-between py-4 text-left"
                    >
                      <span
                        className="text-title font-medium tracking-tight transition-colors duration-700"
                        style={{
                          color: active ? "var(--foreground)" : "var(--dim)",
                        }}
                      >
                        {it}
                      </span>
                      <span
                        className="label transition-transform duration-700 ease-out-expo"
                        style={{
                          color: active ? "var(--accent)" : undefined,
                          transform: active
                            ? "translateX(0)"
                            : "translateX(-6px)",
                          opacity: active ? 1 : 0.4,
                        }}
                      >
                        →
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    data-cursor="link"
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="label underline-sweep transition-colors duration-500 hover:text-foreground"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* el formulario aparece solo cuando eliges un punto de partida */}
          <div className="col-span-12 md:col-span-7 md:col-start-6">
            <div
              className="grid transition-[grid-template-rows,opacity] duration-[900ms] ease-out-expo"
              style={{
                gridTemplateRows: intent ? "1fr" : "0fr",
                opacity: intent ? 1 : 0,
              }}
            >
              <div className="min-h-0 overflow-hidden">
                {sent ? (
                  <div className="border border-border bg-surface p-8">
                    <p className="label text-accent">MENSAJE RECIBIDO</p>
                    <p className="mt-6 text-title font-medium tracking-tight">
                      Gracias — te respondo pronto.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="border-t border-border">
                    <p className="label py-5">
                      TEMA — {intent?.toUpperCase()}
                    </p>
                    {[
                      { name: "name", label: "NOMBRE", type: "text" },
                      { name: "email", label: "EMAIL", type: "email" },
                    ].map((f) => (
                      <div
                        key={f.name}
                        className="hairline-t flex items-center gap-6 py-4"
                      >
                        <label htmlFor={f.name} className="label w-24 shrink-0">
                          {f.label}
                        </label>
                        <input
                          id={f.name}
                          name={f.name}
                          type={f.type}
                          autoComplete="off"
                          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-dim md:text-base"
                          placeholder="—"
                        />
                      </div>
                    ))}
                    <div className="hairline-t flex items-start gap-6 py-4">
                      <label
                        htmlFor="message"
                        className="label w-24 shrink-0 pt-1"
                      >
                        MENSAJE
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-dim md:text-base"
                        placeholder="—"
                      />
                    </div>
                    <div className="hairline-t flex items-center justify-between py-6">
                      <p className="label text-dim">
                        {sending ? "ENVIANDO" : "LISTO"}
                      </p>
                      <button
                        type="submit"
                        data-cursor="artifact"
                        data-cursor-label="ENVIAR"
                        disabled={sending}
                        className="group relative overflow-hidden border border-border-strong px-7 py-3.5 disabled:opacity-60"
                      >
                        <span
                          className="absolute inset-0 bg-accent transition-transform duration-[700ms] ease-out-expo"
                          style={{
                            transform: sending
                              ? "translateY(0)"
                              : "translateY(101%)",
                          }}
                        />
                        <span className="absolute inset-0 translate-y-full bg-accent transition-transform duration-[700ms] ease-out-expo group-hover:translate-y-0" />
                        <span className="label relative text-foreground transition-colors duration-500 group-hover:text-accent-foreground">
                          ENVIAR MENSAJE
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {!intent && (
              <p className="label max-w-[30ch] leading-relaxed text-dim">
                ELIGE UN PUNTO DE PARTIDA Y APARECE EL RESTO.
              </p>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
