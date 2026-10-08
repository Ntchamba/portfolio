// Tout le contenu éditable du portfolio est ici.
export const profile = {
  name: "Ntchamba Alan Ryan",
  role: "Ingénieur polytechnicien, spécialisé en génie logiciel",
  tagline: "Je conçois des applications de gestion et des interfaces web soignées.",
  email: "ton.email@exemple.com",
};

export const navLinks = [
  { id: "about", title: "À propos" },
  { id: "work", title: "Expérience" },
  { id: "tech", title: "Compétences" },
  { id: "projects", title: "Projets" },
  { id: "contact", title: "Contact" },
];

export const about =
  "Ingénieur polytechnicien titulaire d'un Bac+3 et spécialisé en génie logiciel. Passionné par le web moderne et la 3D, j'aime transformer des idées en produits fluides, performants et soignés, de la conception à la mise en production.";

// Chaque expérience devient une « branche » de l'arbre.
export const experiences = [
  {
    title: "Stage — Développeur",
    company: "Modafa",
    date: "Stage",
    color: "#383E56",
    points: [
      "Participation au développement d'une application de gestion automatique d'une ferme.",
    ],
  },
  {
    title: "Projets d'école",
    company: "Génie logiciel",
    date: "Parcours académique",
    color: "#E6DEDD",
    points: [
      "Application de gestion des dépenses.",
      "Application de gestion d'un établissement scolaire.",
      "Application de gestion des tâches.",
    ],
  },
  {
    title: "TP Réseaux & systèmes",
    company: "École",
    date: "Parcours académique",
    color: "#383E56",
    points: [
      "Mise en place d'un réseau.",
      "Supervision et surveillance du trafic avec Wireshark.",
      "Configuration d'un nom de domaine sous Ubuntu Server, avec Apache et dnsmasq.",
    ],
  },
  {
    title: "Planification d'un projet de supervision",
    company: "Work package — Zabbix",
    date: "Parcours académique",
    color: "#E6DEDD",
    points: [
      "Mise en place d'un work package et planification complète d'un projet de supervision d'équipements.",
      "Supervision des équipements avec Zabbix.",
    ],
  },
];

// Compétences : « \n » sépare les lignes affichées sur la boule.
export const technologies = [
  "Gestion\nde projet",
  "Dév.\nWeb",
  "C",
  "Python\nDjango",
  "IA au\nquotidien",
  "Réseau",
  "Admin.\nsystème",
  "Admin.\nréseau",
];

export const skills = [
  "Gestion de projet",
  "Développement web",
  "Développement en C",
  "Python avec Django",
  "Intégration de l'IA dans les tâches quotidiennes",
  "Réseau",
  "Administration système (notions)",
  "Administration réseau (notions)",
];

export const projects = [
  {
    name: "Application de gestion de ferme",
    description: "Application de gestion automatique d'une ferme, développée lors du stage chez Modafa.",
    tags: [
      { name: "gestion", color: "blue-text-gradient" },
      { name: "automatisation", color: "green-text-gradient" },
      { name: "stage", color: "pink-text-gradient" },
    ],
    hue: 140,
    repo: null,
  },
  {
    name: "Gestion d'école en C",
    description: "Application de gestion d'un établissement scolaire développée en langage C.",
    tags: [
      { name: "c", color: "blue-text-gradient" },
      { name: "gestion", color: "green-text-gradient" },
      { name: "école", color: "pink-text-gradient" },
    ],
    hue: 265,
    repo: null,
  },
];
