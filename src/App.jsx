import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar.jsx";
import WaveBg from "./components/WaveBg.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Experience from "./components/Experience.jsx";
import Tech from "./components/Tech.jsx";
import Projects from "./components/Projects.jsx";
import SafeCanvas from "./components/SafeCanvas.jsx";
import Contact from "./components/Contact.jsx";

const StarsCanvas = lazy(() => import("./components/canvas/Stars.jsx"));

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="hero-bg">
        <WaveBg />
        <Hero />
      </div>
      <About />
      <Experience />
      <Tech />
      <Projects />
      <div className="contact-wrap">
        <Contact />
        <SafeCanvas className="stars-layer">
          <Suspense fallback={null}>
            <StarsCanvas />
          </Suspense>
        </SafeCanvas>
      </div>
    </div>
  );
}
