import { Component, useEffect, useRef, useState } from "react";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

class Boundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(err) {
    console.warn("Scène 3D indisponible :", err);
  }
  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const { fallback } = this.props;
    return typeof fallback === "function" ? fallback(error) : fallback;
  }
}

// Lève une erreur (rattrapée par le Boundary) si le navigateur n'offre pas WebGL.
function NeedsWebGL({ children }) {
  if (!hasWebGL()) throw new Error("WebGL n'est pas disponible dans ce navigateur.");
  return children;
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
      {visible && <Boundary fallback={fallback}>
          <NeedsWebGL>{children}</NeedsWebGL>
        </Boundary>}
    </div>
  );
}
