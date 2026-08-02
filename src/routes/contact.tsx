import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteFooter } from "@/components/site/site-footer";
import { socials } from "@/lib/portfolio-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SAID" },
      {
        name: "description",
        content:
          "Tell Said what you are building. Selected collaborations across AI systems, automation and interface work.",
      },
      { property: "og:title", content: "Contact — SAID" },
      {
        property: "og:description",
        content:
          "Tell Said what you are building — selected collaborations in AI, automation and interface work.",
      },
    ],
  }),
  component: ContactPage,
});

const intents = [
  "A product",
  "An AI system",
  "An automation",
  "Something undefined",
];

function ContactPage() {
  const [intent, setIntent] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (!form.get("name") || !form.get("email") || !form.get("message")) {
      toast.error("Three fields. All of them matter.");
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success("Received. I read everything.");
    }, 900);
  };

  return (
    <main>
      <header className="shell pb-[8vh] pt-[22vh]">
        <p className="label">INDEX — 05</p>
        <h1 className="mt-6 text-display font-medium" data-reveal="mask">
          LET&apos;S BUILD
          <br />
          SOMETHING<span className="text-accent">.</span>
        </h1>
      </header>

      <section className="shell hairline-t py-[10vh]">
        <div className="grid grid-cols-12 gap-y-12">
          <div className="col-span-12 md:col-span-4">
            <p className="label">WHAT ARE YOU BUILDING?</p>
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
                          transform: active ? "translateX(0)" : "translateX(-6px)",
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

          {/* form reveals progressively, only after an intent is chosen */}
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
                    <p className="label text-accent">MESSAGE RECEIVED</p>
                    <p className="mt-6 text-title font-medium tracking-tight">
                      Thanks — I&apos;ll come back to you.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="border-t border-border">
                    <p className="label py-5">
                      SUBJECT — {intent?.toUpperCase()}
                    </p>
                    {[
                      { name: "name", label: "NAME", type: "text" },
                      { name: "email", label: "EMAIL", type: "email" },
                    ].map((f) => (
                      <div key={f.name} className="hairline-t flex items-center gap-6 py-4">
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
                      <label htmlFor="message" className="label w-24 shrink-0 pt-1">
                        MESSAGE
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
                        {sending ? "TRANSMITTING" : "READY"}
                      </p>
                      <button
                        type="submit"
                        data-cursor="artifact"
                        data-cursor-label="SEND"
                        disabled={sending}
                        className="group relative overflow-hidden border border-border-strong px-7 py-3.5 disabled:opacity-60"
                      >
                        <span
                          className="absolute inset-0 bg-accent transition-transform duration-[700ms] ease-out-expo"
                          style={{
                            transform: sending ? "translateY(0)" : "translateY(101%)",
                          }}
                        />
                        <span className="absolute inset-0 translate-y-full bg-accent transition-transform duration-[700ms] ease-out-expo group-hover:translate-y-0" />
                        <span className="label relative text-foreground transition-colors duration-500 group-hover:text-accent-foreground">
                          SEND MESSAGE
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {!intent && (
              <p className="label max-w-[30ch] leading-relaxed text-dim">
                PICK A STARTING POINT ON THE LEFT AND THE REST WILL APPEAR.
              </p>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
