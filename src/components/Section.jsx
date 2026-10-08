import { motion } from "framer-motion";

// Enveloppe commune : apparition au scroll + ancre de navigation.
export default function Section({ id, kicker, title, children, className = "" }) {
  return (
    <section id={id} className={`section ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <p className="kicker">{kicker}</p>
        <h2 className="title">{title}</h2>
        {children}
      </motion.div>
    </section>
  );
}
