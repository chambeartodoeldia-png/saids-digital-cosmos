/**
 * Botón flotante de WhatsApp.
 *
 * El verde de WhatsApp está descartado a propósito: en una paleta de azules
 * fríos con un solo acento ámbar, ese verde no pertenece a nada y se lee como
 * un widget pegado encima del sitio. Lo que hace reconocible a WhatsApp no es
 * el color de fondo, es el GLIFO — así que el glifo se mantiene exacto y el
 * color se cambia por el del sitio.
 *
 * A cambio de perder el verde hay que recuperar la llamada de atención por
 * otro lado, y de ahí el movimiento: un degradado que gira despacio por
 * debajo (azul → violeta → teal, los colores que ya usan el orbe y el cursor)
 * más un brillo que barre el botón cada pocos segundos. El botón no se mueve
 * de sitio ni cambia de tamaño solo: lo que se mueve es la luz.
 *
 * El número va escrito, no escondido detrás del enlace: quien prefiera
 * guardarlo o llamar puede leerlo sin pulsar nada.
 */

/** +58 426 2249525 — en formato wa.me (sin signos ni espacios). */
const WHATSAPP_NUMBER = "584262249525";
const WHATSAPP_DISPLAY = "+58 426 2249525";
const WHATSAPP_MESSAGE = "Hola Said, vi tu portfolio y quiero hablar contigo.";

const HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

export function WhatsappButton() {
  return (
    <a
      href={HREF}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      aria-label={`Escribir por WhatsApp al ${WHATSAPP_DISPLAY}`}
      className="wa-fab"
    >
      {/* el degradado que gira, por debajo de todo */}
      <span aria-hidden className="wa-fab-aura" />
      {/* el brillo que barre */}
      <span aria-hidden className="wa-fab-sheen" />

      <span className="wa-fab-inner">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="wa-fab-glyph"
          fill="currentColor"
        >
          {/* glifo oficial de WhatsApp: es lo que hace el botón reconocible */}
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
        </svg>

        <span className="wa-fab-text">
          <span className="wa-fab-line">Escríbeme por WhatsApp</span>
          <span className="wa-fab-num">{WHATSAPP_DISPLAY}</span>
        </span>
      </span>
    </a>
  );
}
