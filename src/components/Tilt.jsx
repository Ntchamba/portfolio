import { useRef } from "react";

// Inclinaison fluide selon la position du curseur (sans dépendance externe).
export default function Tilt({ children, max = 15, className = "" }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${-py * max * 2}deg) rotateY(${px * max * 2}deg) scale3d(1.03,1.03,1.03)`;
  };
  const reset = () => {
    ref.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)";
  };

  return (
    <div ref={ref} className={`tilt ${className}`} onMouseMove={onMove} onMouseLeave={reset}>
      {children}
    </div>
  );
}
