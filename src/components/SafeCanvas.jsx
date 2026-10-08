import { Component, useEffect, useRef, useState } from "react";

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.warn("Scène 3D indisponible :", err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// Isole chaque scène 3D : une erreur WebGL ne fait plus disparaître toute la page,
// et la scène n'est montée que lorsqu'elle est proche de l'écran (moins de contextes WebGL).
export default function SafeCanvas({ children, className = "", style, fallback = null, eager = false }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={style}>
      {visible && <Boundary fallback={fallback}>{children}</Boundary>}
    </div>
  );
}
