// Pavé 3D en CSS pur : six faces positionnées autour d'un centre (x, y, z en px).
export default function Box({ w, h, d, x = 0, y = 0, z = 0, className = "", faces = {}, style }) {
  const face = (name, fw, fh, transform) => (
    <div
      className={`face face--${name}`}
      style={{ width: fw, height: fh, left: -fw / 2, top: -fh / 2, transform }}
    >
      {faces[name]}
    </div>
  );
  return (
    <div className={`box ${className}`} style={{ transform: `translate3d(${x}px, ${y}px, ${z}px)`, ...style }}>
      {face("front", w, h, `translateZ(${d / 2}px)`)}
      {face("back", w, h, `rotateY(180deg) translateZ(${d / 2}px)`)}
      {face("right", d, h, `rotateY(90deg) translateZ(${w / 2}px)`)}
      {face("left", d, h, `rotateY(-90deg) translateZ(${w / 2}px)`)}
      {face("top", w, d, `rotateX(90deg) translateZ(${h / 2}px)`)}
      {face("bottom", w, d, `rotateX(-90deg) translateZ(${h / 2}px)`)}
    </div>
  );
}
