import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import TagWithBarLight from "@/components/BarLight";
import PageNav from "@/components/PageNav";
import ExperienceStrip from "@/components/ExperienceStrip";
import ContactRow from "@/components/ContactRow";
import header from "@/components/InnerHeader.module.css";
import { EXPERIENCES } from "@/content/experiences";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Experiences" };

export default function ExperiencesPage() {
  return (
    <main className="page">
      <SiteChrome />
      <section className={header.section}>
        <h1 className="sr-only">Experiences</h1>
        <TagWithBarLight />
        <PageNav variant="inner" current="/experiences" />
        <div className={styles.list}>
          {EXPERIENCES.map((item, i) => (
            <ExperienceStrip key={`${item.company}-${item.role}`} item={item} index={i} />
          ))}
        </div>
      </section>
      <ContactRow />
    </main>
  );
}
