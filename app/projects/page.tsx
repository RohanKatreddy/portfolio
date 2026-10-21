import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import Tag from "@/components/Tag";
import BarLight from "@/components/BarLight";
import PageNav from "@/components/PageNav";
import ProjectCard from "@/components/ProjectCard";
import ContactRow from "@/components/ContactRow";
import header from "@/components/InnerHeader.module.css";
import { PROJECTS } from "@/content/projects";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <main className="page">
      <SiteChrome />
      <section className={header.section}>
        <h1 className="sr-only">Projects</h1>
        <Tag variant="inner" />
        <PageNav variant="inner" current="/projects" />
        <div className={styles.wrap}>
          <h2 className={styles.heading}>Projects ({PROJECTS.length})</h2>
          {/* No per-card casts: the semi-transparent cards pick up the glow behind them. */}
          <BarLight variant="projects" className={styles.grid}>
            {PROJECTS.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </BarLight>
        </div>
      </section>
      <ContactRow />
    </main>
  );
}
