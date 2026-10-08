// Tout le contenu éditable du portfolio est ici.
export const profile = {
  name: "Ntchamba Alan Ryan",
  role: "Ingénieur polytechnicien, spécialisé en génie logiciel",
  tagline: "Titulaire d'un Bac+3, je conçois des interfaces web et des expériences 3D interactives.",
  email: "ton.email@exemple.com",
};

export const navLinks = [
  { id: "about", title: "À propos" },
  { id: "work", title: "Expérience" },
  { id: "tech", title: "Technologies" },
  { id: "projects", title: "Projets" },
  { id: "contact", title: "Contact" },
];

export const about =
  "Ingénieur polytechnicien titulaire d'un Bac+3 et spécialisé en génie logiciel. Passionné par le web moderne et la 3D, j'aime transformer des idées en produits fluides, performants et soignés, de la conception à la mise en production.";

// Chaque expérience devient une « branche » de l'arbre.
export const experiences = [
  {
    title: "Développeur Front-End",
    company: "Entreprise A",
    date: "Mars 2023 – Aujourd'hui",
    color: "#383E56",
    points: [
      "Développement d'interfaces React réutilisables et accessibles.",
      "Collaboration avec les designers et les développeurs back-end.",
      "Revues de code et amélioration des performances.",
    ],
  },
  {
    title: "Développeur Full-Stack",
    company: "Entreprise B",
    date: "Janv. 2022 – Fév. 2023",
    color: "#E6DEDD",
    points: [
      "Conception d'API et d'applications web de bout en bout.",
      "Mise en place de tests et de pipelines CI/CD.",
      "Participation aux choix d'architecture.",
    ],
  },
  {
    title: "Développeur Web Junior",
    company: "Entreprise C",
    date: "Juin 2021 – Déc. 2021",
    color: "#383E56",
    points: [
      "Intégration de maquettes responsive.",
      "Correction de bugs et maintenance d'applications existantes.",
      "Apprentissage des bonnes pratiques d'équipe.",
    ],
  },
];

// Données de compétences volontairement génériques : à remplacer plus tard.
export const technologies = [
  "React", "JavaScript", "Node.js", "Three.js", "CSS", "Git",
];

export const projects = [
  {
    name: "Projet Un",
    description: "Courte description du projet, de sa stack et de son objectif.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "three.js", color: "green-text-gradient" },
      { name: "css", color: "pink-text-gradient" },
    ],
    hue: 265,
    repo: "https://github.com/",
  },
  {
    name: "Projet Deux",
    description: "Courte description du projet, de sa stack et de son objectif.",
    tags: [
      { name: "node", color: "blue-text-gradient" },
      { name: "api", color: "green-text-gradient" },
      { name: "sql", color: "pink-text-gradient" },
    ],
    hue: 320,
    repo: "https://github.com/",
  },
  {
    name: "Projet Trois",
    description: "Courte description du projet, de sa stack et de son objectif.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "vite", color: "green-text-gradient" },
      { name: "ui", color: "pink-text-gradient" },
    ],
    hue: 190,
    repo: "https://github.com/",
  },
];
