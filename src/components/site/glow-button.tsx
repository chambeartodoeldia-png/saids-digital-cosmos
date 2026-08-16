import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Botón con luz en movimiento — el mismo tratamiento del flotante de
 * WhatsApp, que es el que gustó: degradado que gira por debajo, brillo que
 * barre y cuerpo opaco encima para que el texto no dependa de la animación.
 *
 * Tres formas de renderizarlo:
 *   · `to`      -> Link de router (navegación interna)
 *   · `href`    -> ancla normal
 *   · ninguno   -> <span>. Se usa cuando el botón ya vive DENTRO de un enlace
 *                  (el índice de trabajo): un <a> dentro de otro <a> es HTML
 *                  inválido y el navegador rompe el árbol. Como span hereda
 *                  el clic del enlace padre y se ve exactamente igual.
 */
type GlowButtonProps = {
  children: ReactNode;
  to?: string;
  href?: string;
  className?: string;
  /** `lg` para el de volver al inicio, que tiene que leerse de lejos */
  size?: "md" | "lg";
  cursorLabel?: string;
};

function Shell({
  children,
  size = "md",
}: {
  children: ReactNode;
  size?: "md" | "lg";
}) {
  return (
    <>
      <span aria-hidden className="glow-btn-aura" />
      <span aria-hidden className="glow-btn-sheen" />
      <span className={cn("glow-btn-inner", size === "lg" && "glow-btn-lg")}>
        {children}
      </span>
    </>
  );
}

export function GlowButton({
  children,
  to,
  href,
  className,
  size = "md",
  cursorLabel,
}: GlowButtonProps) {
  const shared = cn("glow-btn", className);

  if (to) {
    return (
      <Link
        to={to}
        data-cursor="link"
        {...(cursorLabel ? { "data-cursor-label": cursorLabel } : {})}
        className={shared}
      >
        <Shell size={size}>{children}</Shell>
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} data-cursor="link" className={shared}>
        <Shell size={size}>{children}</Shell>
      </a>
    );
  }

  return (
    <span className={shared}>
      <Shell size={size}>{children}</Shell>
    </span>
  );
}
