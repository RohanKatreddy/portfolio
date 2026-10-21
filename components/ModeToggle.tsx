"use client";

import { useMode } from "@/lib/theme";
import styles from "./Chrome.module.css";

/** Liquid-glass "Night / Day" pill. Labels for both modes render; CSS shows one. */
export default function ModeToggle() {
  const { isDark, toggle } = useMode();
  return (
    <button
      type="button"
      className={styles.pill}
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
    >
      <span aria-hidden="true" className={styles.pillDisc} />
      <span className="only-light">Night</span>
      <span className="only-dark">Day</span>
    </button>
  );
}
