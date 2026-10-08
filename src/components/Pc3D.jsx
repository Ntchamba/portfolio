import { useEffect, useMemo, useRef } from "react";
import Box from "./Box.jsx";
import { drawScreenCanvas } from "../lib/screenArt.js";

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function Fan({ size = 70, hue = 0 }) {
  return (
    <span className="fan" style={{ width: size, height: size, "--h": `${hue}deg` }}>
      <i />
    </span>
  );
}

function Ring({ size, hue = 0 }) {
  return <span className="spk-ring" style={{ width: size, height: size, "--h": `${hue}deg` }} />;
}

function Speaker({ x }) {
  return (
    <Box
      w={54}
      h={104}
      d={50}
      x={x}
      y={-52}
      z={-95}
      className="b-dark"
      faces={{
        front: (
          <div className="spk">
            <Ring size={22} hue={160} />
            <Ring size={34} hue={300} />
          </div>
        ),
      }}
    />
  );
}

// Ordinateur « réaliste » entièrement en CSS 3D, pivotable à la souris / au doigt.
export default function Pc3D() {
  const wrap = useRef(null);
  const pc = useRef(null);
  const stage = useRef(null);
  const screen = useMemo(() => drawScreenCanvas().toDataURL("image/png"), []);

  // Mise à l'échelle selon l'espace disponible.
  useEffect(() => {
    const el = wrap.current;
    const fit = () => {
      const k = Math.min(el.clientWidth / 960, (el.clientHeight - 400) / 560, 1);
      pc.current.style.setProperty("--k", Math.max(k, 0.36).toFixed(3));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Rotation par glisser-déposer (pas de zoom), l'angle pilote aussi le reflet de l'écran.
  useEffect(() => {
    const el = wrap.current;
    const st = stage.current;
    let ry = -14;
    let rx = -13;
    let drag = null;
    const apply = () => {
      st.style.setProperty("--ry", `${ry}deg`);
      st.style.setProperty("--rx", `${rx}deg`);
      st.style.setProperty("--glare", `${50 + ry * 2.2}%`);
    };
    apply();
    const down = (e) => {
      drag = { x: e.clientX, y: e.clientY };
      el.setPointerCapture?.(e.pointerId);
      el.classList.add("is-dragging");
    };
    const move = (e) => {
      if (!drag) return;
      ry = clamp(ry + (e.clientX - drag.x) * 0.35, -55, 55);
      rx = clamp(rx - (e.clientY - drag.y) * 0.2, -30, -4);
      drag = { x: e.clientX, y: e.clientY };
      apply();
    };
    const up = () => {
      drag = null;
      el.classList.remove("is-dragging");
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div className="pc-wrap" ref={wrap} aria-label="Ordinateur 3D, glisser pour pivoter">
      <div className="pc" ref={pc}>
        <div className="pc-sway">
          <div className="pc-stage" ref={stage}>
            {/* bureau */}
            <Box
              w={820}
              h={26}
              d={420}
              y={13}
              className="b-desk"
              faces={{ top: <div className="desk-top" /> }}
            />

            {/* moniteur */}
            <Box w={34} h={74} d={14} x={-60} y={-37} z={-96} className="b-dark" />
            <Box w={150} h={6} d={92} x={-60} y={-3} z={-70} className="b-dark" />
            <Box
              w={430}
              h={252}
              d={14}
              x={-60}
              y={-200}
              z={-85}
              className="b-dark b-monitor"
              faces={{
                front: (
                  <div className="screen">
                    <img src={screen} alt="Éditeur de code" draggable="false" />
                    <div className="glass" />
                  </div>
                ),
              }}
            />

            <Speaker x={-345} />
            <Speaker x={235} />

            {/* tour RGB */}
            <Box
              w={150}
              h={272}
              d={196}
              x={345}
              y={-136}
              z={-40}
              className="b-dark b-tower"
              faces={{
                front: (
                  <div className="tower-front">
                    <Fan hue={320} />
                    <Fan hue={190} />
                    <Fan hue={260} size={52} />
                    <span className="tower-bar" />
                  </div>
                ),
                left: (
                  <div className="tower-side">
                    <div className="gpu">
                      <Fan size={54} hue={300} />
                      <Fan size={54} hue={30} />
                    </div>
                    <span className="tower-bar" />
                  </div>
                ),
              }}
            />

            {/* clavier RGB */}
            <Box
              w={370}
              h={12}
              d={124}
              x={-60}
              y={-6}
              z={80}
              className="b-dark"
              faces={{ top: <div className="keys" /> }}
            />

            {/* tapis + souris */}
            <Box w={200} h={4} d={124} x={205} y={-2} z={84} className="b-pad" faces={{ top: <div className="pad" /> }} />
            <Box w={26} h={12} d={44} x={210} y={-10} z={84} className="b-mouse" />
          </div>
        </div>
      </div>
    </div>
  );
}
