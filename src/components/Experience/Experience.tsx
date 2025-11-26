import styles from './Experience.module.css';

interface ExperienceItem {
    id: number;
    role: string;
    company: string;
    description: string;
}

export default function Experience() {
    const experiences: ExperienceItem[] = [
        {
            id: 1,
            role: "Software Engineer",
            company: "Solcoa",
            description: "Built SCADA-style reactor control and data acquisition systems"
        },
        {
            id: 2,
            role: "Fixed-Wing Project Manager,  Embedded/Autonomy Developer",
            company: "Waterloo Aerial Robotics Group",
            description: "Building fixed-wing aircraft with a custom in-house autopilot"
        },
        {
            id: 3,
            role: "Propulsion Engineer",
            company: "Waterloo Rocketry",
            description: "Manufactured core components of a N₂O/EtOH liquid engine"
        },
        {
            id: 4,
            role: "Autonomy Engineer",
            company: "WATonomous",
            description: "Worked on hardware and localization for the F1Tenth race car"
        }
    ];

    return (
        <section id="experience" className={styles.experienceSection}>
            <h2 className={styles.title}>My Journey</h2>
            <div className={styles.list}>
                {experiences.map((exp) => (
                    <div key={exp.id} className={styles.item}>
                        <div className={styles.header}>
                            <span className={styles.role}>{exp.role}</span>
                            <span className={styles.company}>{exp.company}</span>
                        </div>
                        <p className={styles.description}>{exp.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
