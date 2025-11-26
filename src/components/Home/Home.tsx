import styles from './Home.module.css'
import TypingAnimation from '../TypingAnimation/TypingAnimation'
import ProjectGallery from '../ProjectGallery/ProjectGallery'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import Navbar from '../Navbar/Navbar'
import Experience from '../Experience/Experience'
import About from '../About/About'
import Projects from '../Projects/Projects'

export default function Home() {
    return (
        <>
            <Navbar />
            <section className={styles.hero} id="home">
                <ThemeToggle />
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        Hey! I&rsquo;m Rohan, a <span className={styles.italic}><TypingAnimation words={['engineer', 'designer', 'developer', 'bird']} /></span>
                    </h1>
                    
                    <div className={styles.subheadings}>
                        <p>I build robots along the lines of flight and AI</p>
                        <p>Take a look around!</p>
                    </div>
                </div>
                
                <div className={styles.rightColumn}>
                    <div className={styles.galleryContainer}>
                        <ProjectGallery />
                    </div>
                </div>
            </section>
            <Experience />
            <About />
            <Projects />
        </>
    )
}
