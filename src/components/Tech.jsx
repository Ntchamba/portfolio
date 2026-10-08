import Section from "./Section.jsx";
import { technologies, skills } from "../data/constants.js";

// Boules « icosaèdre » en CSS : flottent en permanence et tournent sur elles-mêmes au survol.
export default function Tech() {
  return (
    <Section id="tech" kicker="Ce que je maîtrise" title="Compétences.">
      <div className="balls">
        {technologies.map((t, i) => (
          <div className="ball" key={t} style={{ "--d": `${(i % 4) * -1.1}s` }}>
            <div className="ball__body">
              <span className="ball__label">{t}</span>
            </div>
          </div>
        ))}
      </div>
      <ul className="skills">
        {skills.map((k) => (
          <li key={k}>{k}</li>
        ))}
      </ul>
    </Section>
  );
}
