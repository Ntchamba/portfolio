// Icônes SVG « néon » partagées (cartes de présentation et nœuds de l'arbre).
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

const paths = {
  web: (
    <>
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m13.5 5-3 14" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="m7 10 3 2-3 2" />
      <path d="M13 15h4" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="5" cy="18" r="2.2" />
      <circle cx="19" cy="18" r="2.2" />
      <path d="M12 7.2v4.3M12 11.5 6.2 16.3M12 11.5l5.8 4.8" />
    </>
  ),
  project: (
    <>
      <rect x="3" y="4" width="5" height="16" rx="1.5" />
      <rect x="10" y="4" width="5" height="10" rx="1.5" />
      <rect x="17" y="4" width="4" height="6" rx="1.5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 13h18" />
    </>
  ),
  school: (
    <>
      <path d="m2 9 10-5 10 5-10 5Z" />
      <path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="m8 15 3.5-4 3 2.5L19 7" />
    </>
  ),
};

export default function Icon({ name, size = 28 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...stroke} aria-hidden="true">
      {paths[name] ?? paths.web}
    </svg>
  );
}
