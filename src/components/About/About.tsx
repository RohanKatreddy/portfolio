import styles from './About.module.css';
import aboutImage from '../../assets/about_image.png';

export default function About() {
    return (
        <section id="about" className={styles.aboutSection}>
            <h2 className={styles.title}>About</h2>
            <div className={styles.grid}>
                <div className={styles.column}>
                    <img src={aboutImage} alt="About" className={styles.image} />
                </div>
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
            </div>
        </section>
    );
}
