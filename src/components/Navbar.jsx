import { useEffect, useState } from "react";
import { navLinks, profile } from "../data/constants.js";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--solid" : ""}`}>
      <a href="#" className="navbar__logo" aria-label={profile.name} title={profile.name} onClick={() => window.scrollTo(0, 0)}>
        N
      </a>
      <button className="navbar__burger" aria-label="Menu" onClick={() => setOpen(!open)}>
        {open ? "✕" : "☰"}
      </button>
      <ul className={`navbar__links ${open ? "is-open" : ""}`}>
        {navLinks.map((l) => (
          <li key={l.id}>
            <a href={`#${l.id}`} onClick={() => setOpen(false)}>
              {l.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
