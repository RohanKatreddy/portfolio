import Link from "next/link";
import { Fragment } from "react";
import styles from "./PageNav.module.css";

const LINKS = [
  { href: "/projects", label: "projects" },
  { href: "/experiences", label: "experiences" },
] as const;

type Props = {
  /** "home" is slightly larger; inner pages mark the current page. */
  variant: "home" | "inner";
  current?: (typeof LINKS)[number]["href"];
};

export default function PageNav({ variant, current }: Props) {
  return (
    <nav aria-label="Main" className={`${styles.nav} ${styles[variant]}`}>
      {LINKS.map((l, i) => (
        <Fragment key={l.href}>
          {i > 0 && <span aria-hidden="true" className={styles.dot} />}
          {l.href === current ? (
            <span aria-current="page" className={styles.current}>
              {l.label}
            </span>
          ) : (
            <Link href={l.href} className={styles.link}>
              {l.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
