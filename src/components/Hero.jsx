import { motion } from "framer-motion";
import Pc3D from "./Pc3D.jsx";
import { profile } from "../data/constants.js";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__text">
        <div className="hero__anchor" aria-hidden="true">
          <span className="hero__circle" />
          <span className="hero__line violet-gradient" />
        </div>
        <div>
          <h1>
            <span className="accent">{profile.name}</span>
          </h1>
          <p>
            {profile.role}.<br className="hide-sm" /> {profile.tagline}
          </p>
        </div>
      </div>

      <div className="hero__canvas">
        <Pc3D />
      </div>

      <a href="#about" className="hero__scroll" aria-label="Défiler vers le bas">
        <span className="hero__mouse">
          <motion.span
            className="hero__wheel"
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
          />
        </span>
      </a>
    </section>
  );
}
