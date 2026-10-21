import { CONTACT } from "@/content/contact";
import styles from "./ContactRow.module.css";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
      <mask id="contact-li-mask">
        <rect width="20" height="20" rx="3" fill="#fff" />
        <circle cx="5.7" cy="5.6" r="1.45" fill="#000" />
        <rect x="4.5" y="8" width="2.4" height="7.6" fill="#000" />
        <path
          d="M9 8h2.3v1.1c.5-.8 1.4-1.3 2.5-1.3 1.9 0 2.7 1.2 2.7 3.2v4.6h-2.4v-4.1c0-1-.3-1.6-1.2-1.6-.9 0-1.5.6-1.5 1.7v4H9z"
          fill="#000"
        />
      </mask>
      <rect width="20" height="20" fill="currentColor" mask="url(#contact-li-mask)" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 20 20" width="19" height="19" aria-hidden="true" focusable="false" fill="none" stroke="currentColor">
      <polygon points="3.2,3 7,3 16.8,17 13,17" strokeWidth="1.4" strokeLinejoin="round" />
      <line x1="16.4" y1="3" x2="10.9" y2="9.2" strokeWidth="1.7" strokeLinecap="round" />
      <line x1="3.6" y1="17" x2="9.1" y2="10.8" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 20 20" width="21" height="21" aria-hidden="true" focusable="false">
      <path d="M2 5.2v10.3h3.2V9.4l4.8 3.6 4.8-3.6v6.1H18V5.2l-2-1.3-6 4.5-6-4.5z" fill="currentColor" />
    </svg>
  );
}

export default function ContactRow() {
  return (
    <footer className={styles.row}>
      <a href={CONTACT.linkedin} aria-label="LinkedIn" className={styles.icon} target="_blank" rel="noopener noreferrer">
        <LinkedInIcon />
      </a>
      {CONTACT.x ? (
        <a href={CONTACT.x} aria-label="X" className={styles.icon} target="_blank" rel="noopener noreferrer">
          <XIcon />
        </a>
      ) : (
        // TODO(open item 3): no X URL yet.
        <span aria-hidden="true" className={styles.icon}>
          <XIcon />
        </span>
      )}
      <a href={CONTACT.email} aria-label="Email" className={styles.icon}>
        <EmailIcon />
      </a>
    </footer>
  );
}
