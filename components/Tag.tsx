"use client";

import { useState, type PointerEvent } from "react";
import styles from "./Tag.module.css";

type Props = {
  /** "home": big tag, 1400px perspective, deep shadow. "inner": small tag under the bar light. */
  variant: "home" | "inner";
};

/**
 * "Remove Before Flight" tag. Hover (mouse/pen) flips it; on touch-only
 * devices (`hover: none`) a tap toggles it.
 */
export default function Tag({ variant }: Props) {
  const [flipped, setFlipped] = useState(false);

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType !== "touch") setFlipped(true);
  };
  const onLeave = (e: PointerEvent) => {
    if (e.pointerType !== "touch") setFlipped(false);
  };
  const onClick = () => {
    if (window.matchMedia("(hover: none)").matches) setFlipped((f) => !f);
  };

  return (
    <div className={`${styles.tag} ${styles[variant]}`} onPointerEnter={onEnter} onPointerLeave={onLeave} onClick={onClick}>
      <div className={styles.card} data-flipped={flipped || undefined}>
        <div role="img" aria-label="Rohan Katreddy" className={styles.face}>
          <div className={`${styles.art} ${styles.front}`} />
        </div>
        <div role="img" aria-label="Remove before flight" className={`${styles.face} ${styles.back}`}>
          <div className={`${styles.art} ${styles.backArt}`} />
        </div>
      </div>
    </div>
  );
}
