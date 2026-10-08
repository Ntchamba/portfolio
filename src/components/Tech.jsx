import { Suspense, lazy } from "react";
import Section from "./Section.jsx";
import { technologies } from "../data/constants.js";

const BallCanvas = lazy(() => import("./canvas/Ball.jsx"));

export default function Tech() {
  return (
    <Section id="tech" kicker="Mes outils" title="Technologies.">
      <div className="balls">
        {technologies.map((t) => (
          <div className="balls__item" key={t} title={t}>
            <Suspense fallback={null}>
              <BallCanvas label={t} />
            </Suspense>
          </div>
        ))}
      </div>
    </Section>
  );
}
