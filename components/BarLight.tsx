"use client";

import { useEffect, useState } from "react";
import { useMode } from "@/lib/theme";
import Tag from "./Tag";
import styles from "./BarLight.module.css";

/**
 * The inner-page tag under a vintage aged-brass picture light.
 * lit = lampOverride ?? isDark. Pulling the chain only changes the light;
 * switching Night/Day clears the override so the light follows the mode.
 */
export default function TagWithBarLight() {
  const { isDark } = useMode();
  const [lampOverride, setLampOverride] = useState<boolean | null>(null);

  useEffect(() => setLampOverride(null), [isDark]);

  const lit = lampOverride ?? isDark;
  // "auto" lets CSS follow html[data-mode] before hydration, so there is no flash.
  const lamp = lampOverride === null ? "auto" : lampOverride ? "on" : "off";

  return (
    <div className={styles.mount} data-lamp={lamp}>
      <div aria-hidden="true" className={styles.glow} />
      <Tag variant="inner" />
      <div className={styles.fixture}>
        <div aria-hidden="true" className={styles.rod} style={{ left: "28%" }} />
        <div aria-hidden="true" className={styles.rod} style={{ left: "72%" }} />
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
        <div aria-hidden="true" className={styles.bar}>
          <div className={styles.knob} style={{ left: "30%" }} />
          <div className={styles.knob} style={{ left: "68%" }} />
          <div className={styles.tube}>
            <div className={styles.tubeWear} />
            <div className={styles.tubeHighlight} />
          </div>
          <div className={styles.diffuser} />
          <div className={styles.diffuserLit} />
          <div className={`${styles.cap} ${styles.capLeft}`} />
          <div className={`${styles.cap} ${styles.capRight}`} />
        </div>
      </div>
    </div>
  );
}
