"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useMode } from "@/lib/theme";
import styles from "./BarLight.module.css";

type Props = {
  /** Picks the glow pool size: Projects uses a larger one. */
  variant: "experiences" | "projects";
  /** Layout class for the block itself (the strip list or the card grid). */
  className?: string;
  children: ReactNode;
};

/**
 * Vintage aged-brass picture light mounted along the top edge of a content
 * block (the strip list on Experiences, the card grid on Projects).
 * lit = lampOverride ?? isDark. Pulling the chain only changes the light;
 * switching Night/Day clears the override so the light follows the mode.
 * The block carries data-lamp so children (e.g. strip light casts) can react.
 */
export default function BarLight({ variant, className, children }: Props) {
  const { isDark } = useMode();
  const [lampOverride, setLampOverride] = useState<boolean | null>(null);

  useEffect(() => setLampOverride(null), [isDark]);

  const lit = lampOverride ?? isDark;
  // "auto" lets CSS follow html[data-mode] before hydration, so there is no flash.
  const lamp = lampOverride === null ? "auto" : lampOverride ? "on" : "off";

  return (
    <div className={`${styles.block} ${className ?? ""}`} data-lamp={lamp}>
      <div aria-hidden="true" className={`${styles.glow} ${styles[variant]}`} />
      <div className={styles.fixture}>
        <div aria-hidden="true" className={styles.tube}>
          <div className={styles.tubeWear} />
          <div className={styles.tubeHighlight} />
        </div>
        <div aria-hidden="true" className={styles.diffuser} />
        <div aria-hidden="true" className={styles.diffuserLit} />
        <div aria-hidden="true" className={`${styles.cap} ${styles.capLeft}`} />
        <div aria-hidden="true" className={`${styles.cap} ${styles.capRight}`} />
        <button
          type="button"
          className={styles.chain}
          onClick={() => setLampOverride(!lit)}
          aria-label={lit ? "Turn the light off" : "Turn the light on"}
          aria-pressed={lit}
          title="Pull the chain"
        >
          <span className={styles.beads} />
          <span className={styles.pull} />
        </button>
      </div>
      {children}
    </div>
  );
}
