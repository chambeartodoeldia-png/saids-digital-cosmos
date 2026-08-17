/**
 * Fondo del hero: rejilla hairline, luz de ambiente, suelo frío y grano.
 *
 * SIN MOVIMIENTO, y es a propósito.
 *
 * Antes esto llevaba un requestAnimationFrame permanente que movía la rejilla
 * y una luz siguiendo al puntero. Se quitó por dos motivos, en este orden:
 *
 *  1. Competía con el elemento firma. En el hero ya se mueven el shader (las
 *     auroras) y el orbe (disco y arco girando). Una tercera capa reaccionando
 *     al ratón no añade jerarquía, la borra: cuando todo se mueve, nada
 *     destaca. El orbe es lo que tiene que mirarse; esto es su fondo.
 *  2. El bucle no paraba nunca. Corría con el hero fuera de pantalla, con la
 *     pestaña en segundo plano y con "menos movimiento" activado, que además
 *     era una infracción — el parallax es justo uno de los disparadores
 *     vestibulares que esa preferencia pide evitar.
 *
 * Lo que se ve no cambió: misma rejilla, mismas luces, mismo grano. Lo único
 * que desapareció es que persiguieran al ratón. Componente sin estado, sin
 * efectos y sin listeners: en móvil no cuesta absolutamente nada.
 */
export function HeroField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="field-grid absolute -inset-[10%] opacity-70" />

      {/* luz de ambiente, ahora fija en el centro alto de la composición */}
      <div
        className="absolute -inset-[20%]"
        style={{
          background:
            "radial-gradient(38rem 38rem at 50% 42%, color-mix(in oklab, var(--accent) 9%, transparent), transparent 70%)",
        }}
      />

      {/*
        Suelo del hero. Es teal y no blanco: así el hero queda frío abajo y la
        luz cálida de arriba destaca por contraste de temperatura, no sólo de
        brillo.
      */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70rem 40rem at 50% 120%, var(--wash-cool), transparent 65%)",
        }}
      />

      <div className="noise absolute inset-0 opacity-[0.04]" />
      <div className="absolute inset-x-0 top-0 h-px bg-border" />
    </div>
  );
}
