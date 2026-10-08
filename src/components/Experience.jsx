import { motion } from "framer-motion";
import Section from "./Section.jsx";
import Icon from "./Icons.jsx";
import { experiences } from "../data/constants.js";

// « L'arbre » : un tronc central, des bourgeons (nœuds) et des branches (cartes) alternées.
export default function Experience() {
  return (
    <Section id="work" kicker="Ce que j'ai fait jusqu'ici" title="Parcours & expérience.">
      <ol className="tree">
        {experiences.map((exp, i) => {
          const side = i % 2 === 0 ? "left" : "right";
          return (
            <motion.li
              key={exp.title + exp.company}
              className={`tree__item tree__item--${side}`}
              initial={{ opacity: 0, x: side === "left" ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <span className="tree__date">{exp.date}</span>
              <span className="tree__bud" style={{ background: exp.color, color: exp.color === "#E6DEDD" ? "#1d1836" : "#fff" }}>
                <Icon name={exp.icon} size={26} />
              </span>
              <article className="tree__card">
                <h3>{exp.title}</h3>
                <p className="tree__company">{exp.company}</p>
                <ul>
                  {exp.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </article>
            </motion.li>
          );
        })}
      </ol>
    </Section>
  );
}
