import SiteChrome from "@/components/SiteChrome";
import Tag from "@/components/Tag";
import PageNav from "@/components/PageNav";
import ContactRow from "@/components/ContactRow";
import Intro from "@/components/intro/Intro";
import { INTRO_ENABLED } from "@/lib/site";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <main className="page">
        <SiteChrome />
        <section className={styles.hero}>
          <h1 className="sr-only">Rohan Katreddy</h1>
          <Tag variant="home" />
          <p className={styles.oneLiner}>
            <span className={styles.muted}>Building stuff in:</span>{" "}
            <span className={styles.strong}>Aerial robotics and AI</span>
          </p>
          <PageNav variant="home" />
        </section>
        <ContactRow />
      </main>
      {INTRO_ENABLED && <Intro />}
    </>
  );
}
