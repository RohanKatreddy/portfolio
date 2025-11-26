import styles from './ProjectGallery.module.css';

export default function ProjectGallery() {
    // Enhanced placeholder data with different "sizes" for organized chaos
    const projects = [
        { id: 1, title: "Neural Network from Scratch", desc: "Handwritten-digit classifier using NNs", size: "large" },
        { id: 2, title: "Waypoint Autonomy for Cars", desc: "Handwritten-digit classifier using NNs", size: "medium" },
        { id: 3, title: "4 Bit CPU", desc: "CPU composed with 1000+ BJT transistors", size: "medium" },
        { id: 4, title: "Hyperic", desc: "Fully autonomous scalable drones", size: "medium" },
        { id: 5, title: "Fixed-wing Aircraft", desc: "A robust modular 1.5m wingspan plane", size: "wide" },
        { id: 6, title: "Apocalyft", desc: "Uber for UAVs", size: "medium" },
        { id: 7, title: "Solar Weather Station", desc: "Wind/Temp/Humidity/Rain logging system", size: "medium" },
        { id: 8, title: "Flora Feed", desc:  "App enabled auto plant watering system", size: "large" },
    ];

    // Split projects into two columns for masonry effect
    const column1 = projects.filter((_, i) => i % 2 === 0);
    const column2 = projects.filter((_, i) => i % 2 !== 0);

    // Duplicate data for infinite loop
    const renderColumn = (items: typeof projects, colIndex: number) => (
        <div className={styles.columnWrapper}>
            <div className={styles.column} style={{ animationDelay: colIndex === 1 ? '-10s' : '0s' }}>
                {[...items, ...items, ...items].map((project, index) => (
                    <div key={`${project.id}-${index}`} className={`${styles.card} ${styles[project.size]}`}>
                        <div className={styles.cardImage} />
                        <h3 className={styles.cardTitle}>{project.title}</h3>
                        <p className={styles.cardDescription}>{project.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className={styles.galleryContainer}>
            {renderColumn(column1, 0)}
            {renderColumn(column2, 1)}
            {/* Gradient overlays to hide cutoffs */}
            <div className={styles.overlayTop} />
            <div className={styles.overlayBottom} />
        </div>
    );
}
