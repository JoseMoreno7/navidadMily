"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  const [step, setStep] = useState(0);
  const [sealHits, setSealHits] = useState(0); // 0..3

  return (
    <main className="mainStage">
      {step === 0 && <FlowerScreen onNext={() => setStep(1)} />}

      {step === 1 && (
        <EnvelopeFlip
          from="José"
          to="Mily 💖"
          onFlipped={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <EnvelopeSeal
          hits={sealHits}
          setHits={setSealHits}
          onOpen={() => setStep(3)}
        />
      )}

      {step === 3 && <Letter />}
    </main>
  );
}

/* -------------------- STEP 0: FLOR (placeholder por ahora) -------------------- */
function FlowerScreen({ onNext }) {
  return (
    <section className="centerStage">
      {/* Placeholder (luego lo cambias por tu PNG) */}
      <button className="roseBtn" onClick={onNext} aria-label="Continuar">
        <img className="rosePng" src="images/rose.png" alt="Rosa" />
      </button>


      <p className="hintText">Desliza o toca la rosa 🌹</p>
    </section>
  );
}

/* -------------------- STEP 1: SOBRE (FLIP 3D) -------------------- */
function EnvelopeFlip({ from, to, onFlipped }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!flipped) return;
    const t = setTimeout(() => onFlipped(), 650);
    return () => clearTimeout(t);
  }, [flipped, onFlipped]);

  return (
    <section className="centerStage">
      <div className="flipWrap">
        <div className={`flipCard ${flipped ? "flipped" : ""}`}>
          {/* Front */}
          <button
            className="envelopeFace envelopeFront"
            onClick={() => setFlipped(true)}
            aria-label="Voltear el sobre"
          >
            <div className="metaLine">
              <span className="metaLabel">De:</span> <strong>{from}</strong>
            </div>
            <div className="metaLine">
              <span className="metaLabel">Para:</span> <strong>{to}</strong>
            </div>
            <div className="tinyNote">(Toca para voltear)</div>

            {/* Dedo guía */}
            <FingerHint
              mode="tap-right"
              text="Voltea aquí"
            />
          </button>

          {/* Back (solo visual, la lógica real está en step 2) */}
          <div className="envelopeFace envelopeBackFake" aria-hidden="true">
            <div className="sealPreview">Te amo</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- STEP 2: SELLO 3 TOQUES + SWIPE UP -------------------- */
function EnvelopeSeal({ hits, setHits, onOpen }) {
  const broken = hits >= 3;
  const startY = useRef(null);

  const handleTapSeal = () => {
    if (broken) return;
    setHits((h) => Math.min(3, h + 1));
  };

  const onTouchStart = (e) => {
    startY.current = e.touches?.[0]?.clientY ?? null;
  };

  const onTouchEnd = (e) => {
    if (!broken) return;
    const endY = e.changedTouches?.[0]?.clientY ?? null;
    if (startY.current == null || endY == null) return;
    const delta = endY - startY.current; // swipe up => negative
    if (delta < -40) onOpen();
    startY.current = null;
  };

  return (
    <section className="centerStage">
      <div
        className="envelopeOpenStage"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="envelopeBackReal">
          <button
            className={`seal ${broken ? "broken" : ""} hits-${hits}`}
            onClick={handleTapSeal}
            aria-label="Sello te amo"
          >
            Te amo
          </button>

          {!broken ? (
            <>
              <div className="tinyNote">(Toca el sello 3 veces)</div>
              <FingerHint mode="tap-seal" text="Toca aquí" />
            </>
          ) : (
            <>
              <div className="tinyNote">(Ahora desliza hacia arriba para abrir)</div>
              <FingerHint mode="swipe-up" text="Desliza ↑" />
              <button className="openBtn" onClick={onOpen}>
                Abrir carta
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------- STEP 3: CARTA ABIERTA + ADORNOS -------------------- */
function Letter() {
  const snow = useMemo(() => Array.from({ length: 18 }, (_, i) => i), []);

  return (
    <section className="letterStage">
      {/* adornos */}
      <div className="garland" aria-hidden="true" />
      <div className="snow" aria-hidden="true">
        {snow.map((i) => (
          <span key={i} className="flake" />
        ))}
      </div>

      <article className="letterCard">
        <h1 className="letterTitle">🎄 Feliz Navidad, Mily</h1>

        <p className="letterText">
          Hoy quise regalarte algo diferente: una cartita que se abre paso a paso,
          como todo lo bonito que construimos juntos.
        </p>

        <p className="letterText">
          Gracias por tu amor, por tu paciencia, por tu manera de cuidar, y por ser
          esa persona que convierte un día normal en un recuerdo.
        </p>

        <p className="letterText">
          Esta Navidad solo quiero que lo recuerdes siempre: <strong>te amo</strong>,
          y me siento afortunado de caminar contigo.
        </p>

        <div className="letterSign">
          Con todo mi amor,<br />
          <strong>José 💙</strong>
        </div>
      </article>
    </section>
  );
}

/* -------------------- DEDO GUÍA -------------------- */
function FingerHint({ mode, text }) {
  return (
    <div className={`fingerHint ${mode}`} aria-hidden="true">
      <div className="finger">☝️</div>
      <div className="fingerText">{text}</div>
    </div>
  );
}
