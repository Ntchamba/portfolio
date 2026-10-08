import { motion } from "framer-motion";
import Section from "./Section.jsx";
import Tilt from "./Tilt.jsx";
import Icon from "./Icons.jsx";
import { about, services } from "../data/constants.js";

export default function About() {
  return (
    <Section id="about" kicker="Introduction" title="Aperçu.">
      <p className="lead">{about}</p>
      <div className="services">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
          >
            <Tilt className="service" max={18}>
              <span className="service__icon">
                <Icon name={s.icon} size={44} />
              </span>
              <h3>{s.title}</h3>
            </Tilt>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
