/**
 * Cuerpo azul con anillo, en el hueco de arriba a la derecha del hero.
 *
 * La referencia es un agujero negro con disco de acreción: el anillo pasa por
 * DETRÁS del cuerpo por arriba y por DELANTE por abajo, y por eso se lee como
 * un objeto en el espacio y no como una pegatina. Eso es lo que reproduce la
 * estructura de aquí abajo, en azules.
 *
 * Cómo se consigue el cruce, que es el único truco del componente:
 *
 *   El disco es una elipse (un círculo con rotateX, o sea visto casi de
 *   canto). Se pinta DOS VECES, con el cuerpo en medio:
 *     · una copia recortada a la mitad superior de la pantalla, por debajo
 *       del cuerpo  -> el arco que se va por detrás;
 *     · otra recortada a la mitad inferior, por encima del cuerpo
 *       -> el arco que pasa por delante.
 *   El recorte va en un envoltorio SIN transformar, así que corta en
 *   coordenadas de pantalla y no en el espacio girado del disco.
 *
 * Todo el movimiento es CSS: cero JavaScript, cero listeners, cero estado. No
 * puede desincronizar la hidratación ni cuesta un solo frame de React. Con
 * prefers-reduced-motion las dos animaciones se paran y queda una imagen fija,
 * que sigue funcionando como composición.
 */
export function HeroOrb() {
  return (
    <div aria-hidden className="hero-orb">
      <div className="orb-halo" />

      {/* mitad de atrás del anillo: se dibuja antes que el cuerpo */}
      <div className="orb-plane orb-plane--back">
        <div className="orb-disc">
          <div className="orb-mat" />
        </div>
      </div>

      <div className="orb-body">
        {/* bandas que corren: es lo que hace que el cuerpo parezca girar */}
        <div className="orb-skin" />
      </div>

      {/* mitad de delante: se dibuja después, así tapa al cuerpo */}
      <div className="orb-plane orb-plane--front">
        <div className="orb-disc">
          <div className="orb-mat" />
        </div>
      </div>
    </div>
  );
}

export default HeroOrb;
