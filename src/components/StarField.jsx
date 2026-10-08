import { useEffect, useRef } from "react";

// 5000 particules violettes en sphère qui tournent lentement (canvas 2D, sans WebGL).
export default function StarField({ className = "stars-layer" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const N = 5000;
    const pts = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r = Math.cbrt(Math.random());
      pts[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pts[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pts[i * 3 + 2] = r * Math.cos(ph);
    }
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let ax = 0;
    let ay = 0;
    let last = performance.now();
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!reduce) {
        ax -= dt / 10;
        ay -= dt / 15;
      }
      const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
      ctx.clearRect(0, 0, w, h);
      const R = Math.max(w, h) * 0.75;
      for (let i = 0; i < N; i++) {
        const x0 = pts[i * 3], y0 = pts[i * 3 + 1], z0 = pts[i * 3 + 2];
        const y1 = y0 * cx - z0 * sx;
        const z1 = y0 * sx + z0 * cx;
        const x2 = x0 * cy + z1 * sy;
        const z2 = -x0 * sy + z1 * cy;
        const depth = 1 / (1.6 - z2 * 0.6);
        const px = w / 2 + x2 * R * depth;
        const py = h / 2 + y1 * R * depth;
        if (px < 0 || py < 0 || px > w || py > h) continue;
        ctx.globalAlpha = 0.25 + 0.65 * depth * (0.6 + z2 * 0.4);
        ctx.fillStyle = "#b8a2ff";
        ctx.fillRect(px, py, 1.4, 1.4);
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
