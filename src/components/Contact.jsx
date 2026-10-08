import { Suspense, lazy, useState } from "react";
import Section from "./Section.jsx";
import { profile } from "../data/constants.js";

const EarthCanvas = lazy(() => import("./canvas/Earth.jsx"));

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Sans backend : ouvre le client mail avec le message pré-rempli.
  const onSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message de ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <Section id="contact" kicker="Prenons contact" title="Contact." className="contact">
      <div className="contact__grid">
        <form className="contact__form" onSubmit={onSubmit}>
          <label>
            Ton nom
            <input name="name" value={form.name} onChange={onChange} placeholder="Comment t'appelles-tu ?" required />
          </label>
          <label>
            Ton e-mail
            <input type="email" name="email" value={form.email} onChange={onChange} placeholder="Ton adresse e-mail" required />
          </label>
          <label>
            Ton message
            <textarea name="message" rows="6" value={form.message} onChange={onChange} placeholder="Que veux-tu me dire ?" required />
          </label>
          <button type="submit">{sent ? "Ouvert dans ta messagerie ✓" : "Envoyer"}</button>
        </form>
        <div className="contact__earth">
          <Suspense fallback={null}>
            <EarthCanvas />
          </Suspense>
        </div>
      </div>
    </Section>
  );
}
