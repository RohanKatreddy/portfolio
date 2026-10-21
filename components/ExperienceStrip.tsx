import type { Experience } from "@/content/experiences";
import styles from "./ExperienceStrip.module.css";

const TILTS = ["-3deg", "2deg", "-1.5deg", "2.5deg", "-2deg", "1.5deg"];
/** How strongly the bar light falls on each strip, top down, when it is lit. */
const LIGHT = [1, 0.34, 0.1];

/** An ATC flight progress strip in a brushed-silver holder. */
export default function ExperienceStrip({ item, index }: { item: Experience; index: number }) {
  const seq = String(index + 1).padStart(2, "0");
  return (
    <article className={styles.holder}>
      <div className={`${styles.paper} ${item.cells ? styles.withCells : ""}`}>
        <div className={styles.identity}>
          <h2 className={styles.company}>{item.company}</h2>
          <div className={styles.role}>{item.role}</div>
          <div aria-hidden="true" className={styles.barcode} />
        </div>

        <div className={styles.year}>
          <div className={styles.label}>YR</div>
          <div className={styles.start}>
            <span className="sr-only">From </span>
            {item.start}
          </div>
          <div aria-hidden="true" className={styles.seq} style={{ transform: `rotate(${TILTS[index % TILTS.length]})` }}>
            {seq}
          </div>
          <div className={styles.end}>
            <span aria-hidden="true" className={styles.arrow}>
              →{" "}
            </span>
            <span className="sr-only">to </span>
            {item.end}
          </div>
        </div>

        <div className={styles.impact}>
          <div className={styles.impactHead}>
            <span className={styles.label}>IMPACT</span>
            {item.current && <span className={styles.now}>NOW</span>}
          </div>
          <div className={styles.lines}>
            {item.impact.slice(0, 1).map((line) => (
              <div key={line} className={styles.line}>
                <span aria-hidden="true" className={styles.dash}>
                  –
                </span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>

        {item.cells && (
          <div aria-hidden="true" className={styles.cells}>
            <div />
            <div />
            <div />
          </div>
        )}
      </div>
      {/* Warm light from the bar above, strongest on the top strip. */}
      <div aria-hidden="true" className={styles.cast} style={{ ["--light" as string]: LIGHT[index] ?? 0 }} />
      <div aria-hidden="true" className={styles.castSoft} style={{ ["--light" as string]: LIGHT[index] ?? 0 }} />
    </article>
  );
}
