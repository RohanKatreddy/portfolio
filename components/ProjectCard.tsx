import type { Project } from "@/content/projects";
import HoverVideo from "./HoverVideo";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project }: { project: Project }) {
  const { title, year, image, video, placeholder, description } = project;
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {image ? (
          <>
            {/* Both drawings render; CSS shows the one for the current mode, and
                the hidden one is not fetched (lazy + display:none). */}
            <img src={`/assets/projects/${image}.png`} alt={title} loading="lazy" decoding="async" className={`${styles.img} only-light`} />
            <img src={`/assets/projects/${image}Dark.png`} alt={title} loading="lazy" decoding="async" className={`${styles.img} only-dark`} />
          </>
        ) : (
          <div className={styles.placeholder}>{placeholder ?? "DRAWING COMING SOON"}</div>
        )}
        {video && <HoverVideo src={video} />}
      </div>
      <div className={styles.text}>
        {/* TODO(open item 1): "20XX" until the real year is known. */}
        <div className={styles.year}>{year ?? "20XX"}</div>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.desc}>{description}</p>}
      </div>
    </article>
  );
}
