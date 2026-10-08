import { Suspense, lazy, useEffect, useRef, useState } from "react";
import Section from "./Section.jsx";
import SafeCanvas from "./SafeCanvas.jsx";
import { technologies } from "../data/constants.js";

const BallsCanvas = lazy(() => import("./canvas/Balls.jsx"));
const CELL = 150;

export default function Tech() {
  const wrap = useRef(null);
  const [height, setHeight] = useState(CELL);

  // La hauteur dépend du nombre de colonnes qui tiennent dans la largeur disponible.
  useEffect(() => {
    const el = wrap.current;
    const update = () => {
      const cols = Math.max(1, Math.min(technologies.length, Math.floor(el.clientWidth / CELL)));
      setHeight(Math.ceil(technologies.length / cols) * CELL);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Section id="tech" kicker="Mes outils" title="Technologies.">
      <div ref={wrap} className="balls">
        <SafeCanvas style={{ height }}>
          <Suspense fallback={null}>
            <BallsCanvas labels={technologies} />
          </Suspense>
        </SafeCanvas>
      </div>
    </Section>
  );
}
