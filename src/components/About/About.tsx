import styles from './About.module.css';

export default function About() {
    return (
        <section id="about" className={styles.aboutSection}>
            <h2 className={styles.title}>About</h2>
            <div className={styles.grid}>
                <div className={styles.column}>
                    <p className={styles.text}>
                        I&rsquo;m an engineer keen on autonomy, flight, and changing up the world. Currently building <span className={styles.link}>fully autonomous scalable drones</span>.
                    </p>
                </div>
                <div className={styles.column}>
                    <p className={styles.text}>
                         Also studying CS at UWaterloo, with previous internships in SF. I previously worked on safety critical SCADA systems for reactors, and custom autopilots.
                    </p>
                </div>
                <div className={styles.column}>
                    <p className={styles.text}>
                        This site holds my <span className={styles.link}>work</span> and <span className={styles.link}>writings</span>.
                        <br /><br />
                        Reach out at <span className={styles.link}>@Rohan</span> or at rohan [at] portfolio [dot] org.
                    </p>
                </div>
            </div>
        </section>
    );
}

