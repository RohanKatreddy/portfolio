import styles from './Projects.module.css';

interface Project {
    id: number;
    title: string;
    description: string;
    link: string;
}

export default function Projects() {
    const projects: Project[] = [
        {
            id: 1,
            title: "Neural Network from Scratch",
            description: "Handwritten-digit classifier using NNs",
            link: "#"
        },
        {
            id: 2,
            title: "Waypoint Autonomy for Cars",
            description: "Autonomously navigate to waypoints",
            link: "#"
        },
        {
            id: 3,
            title: "4 Bit CPU",
            description: "CPU composed with 1000+ BJT transistors",
            link: "#"
        },
        {
            id: 4,
            title: "Hyperic",
            description: "Fully autonomous scalable drones",
            link: "#"
        },
        {
            id: 5,
            title: "Fixed-wing Aircraft",
            description: "A robust modular 1.5m wingspan plane",
            link: "#"
        },
        {
            id: 6,
            title: "Apocalyft",
            description: "Uber for UAVs",
            link: "#"
        },
        {
            id: 7,
            title: "Solar Weather Station",
            description: "Wind/Temp/Humidity/Rain logging system",
            link: "#"
        },
        {
            id: 8,
            title: "Flora Feed",
            description: "App enabled auto plant watering system",
            link: "#"
        }
    ];

    return (
        <section id="projects" className={styles.projectsSection}>
            <div className={styles.header}>
                <h2 className={styles.sectionTitle}>Projects</h2>
                <a href="#" className={styles.viewAllLink}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </a>
            </div>
            <div className={styles.grid}>
                {projects.map((project) => (
                    <a 
                        key={project.id} 
                        href={project.link}
                        className={styles.card}
                    >
                        <div className={styles.cardHeader}>
                            <h3 className={styles.title}>{project.title}</h3>
                            <div className={styles.icon}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <p className={styles.description}>{project.description}</p>
                    </a>
                ))}
            </div>
        </section>
    );
}
