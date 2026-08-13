/**
 * Cuerpo oscuro con disco de acreción, a la derecha del hero.
 *
 * La referencia es un agujero negro: un centro apagado y un disco brillante
 * que lo rodea. Lo que hace que se lea como algo real y no como un aro pegado
 * son tres cosas, y las tres están aquí:
 *
 *   1. EL DISCO CRUZA. Pasa por DETRÁS del cuerpo por arriba y por DELANTE
 *      por abajo. Es la misma elipse pintada dos veces, recortada por
 *      mitades, con el cuerpo en medio del orden de pintado.
 *
 *   2. LOS ARCOS DE LENTE. Por encima y por debajo del cuerpo aparece otra
 *      vez el disco, curvado. En la foto real eso es la parte de atrás del
 *      disco, cuya luz se dobla alrededor del cuerpo y vuelve hacia ti. Sin
 *      estos dos arcos la figura se queda en "aro con bola" — son ellos los
 *      que dan la lectura de la imagen.
 *
 *   3. NO VA RECTO. Todo el conjunto va inclinado, así que el disco corre en
 *      diagonal y no como una raya horizontal por el centro.
 *
 * El brillo no es uniforme a lo largo del disco: se concentra en un tramo.
 * Eso imita el efecto Doppler (la materia que viene hacia ti brilla más) y,
 * de paso, es lo único que hace visible el giro: un anillo de brillo parejo
 * girando es indistinguible de uno quieto.
 *
 * Todo el movimiento es CSS. Cero JavaScript, cero estado, cero listeners: no
 * puede desincronizar la hidratación ni cuesta un frame de React. Con
 * prefers-reduced-motion las animaciones se paran y queda la imagen fija, que
 * sigue funcionando como composición.
 */
export function HeroOrb() {
  return (
    <div aria-hidden className="hero-orb">
      <div className="orb-tilt">
        <div className="orb-glow" />

        {/* arco de lente de arriba: la parte de atrás del disco, doblada */}
        <div className="orb-lens orb-lens--top">
          <div className="orb-lens-ring" />
        </div>

        {/* mitad de atrás del disco: se pinta antes que el cuerpo */}
        <div className="orb-plane orb-plane--back">
          <div className="orb-disc">
            <div className="orb-mat" />
          </div>
        </div>

        <div className="orb-body">
          {/* filo de luz pegado a la silueta */}
          <div className="orb-photon" />
        </div>

        {/* mitad de delante: se pinta después, así cruza por encima */}
        <div className="orb-plane orb-plane--front">
          <div className="orb-disc">
            <div className="orb-mat" />
          </div>
        </div>

        {/*
          NO hay arco de lente inferior, y no es un olvido. La luz doblada por
          debajo baja hasta la altura del titular de la columna derecha, y al
          medirlo cruzaba el 37% de ese texto. Para que cupiera había que
          bajar el cuerpo de 320px a 240px: el arco de abajo costaba un tercio
          del tamaño de la figura. El de arriba, que es el que da la lectura
          de la referencia, se queda.
        */}
      </div>
    </div>
  );
}

export default HeroOrb;
