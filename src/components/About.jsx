import Section from "./Section.jsx";
import { about } from "../data/constants.js";

export default function About() {
  return (
    <Section id="about" kicker="Introduction" title="À propos.">
      <p className="lead">{about}</p>
    </Section>
  );
}
