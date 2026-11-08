import { memo } from "react";

function HologramBackdrop() {
  return (
    <div className="why-structure" aria-hidden="true" />
  );
}

export default memo(HologramBackdrop);
