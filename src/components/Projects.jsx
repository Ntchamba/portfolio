import { motion } from "framer-motion";
import Section from "./Section.jsx";
import Tilt from "./Tilt.jsx";
import { projects } from "../data/constants.js";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.76 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export default function Projects() {
  return (
    <Section id="projects" kicker="Mon travail" title="Projets.">
      <div className="cards">
        {projects.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          >
            <Tilt className="card">
              <div
                className="card__img"
                style={{
                  background: `radial-gradient(circle at 30% 20%, hsl(${p.hue} 90% 65% / .9), transparent 55%), linear-gradient(135deg, hsl(${p.hue} 60% 25%), #0d0820)`,
                }}
              >
                {p.repo && (
                <a className="card__gh" href={p.repo} target="_blank" rel="noreferrer" aria-label={`Code source de ${p.name}`}>
                  <GithubIcon />
                </a>
                )}
              </div>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <div className="card__tags">
                {p.tags.map((t) => (
                  <span key={t.name} className={t.color}>
                    #{t.name}
                  </span>
                ))}
              </div>
            </Tilt>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
