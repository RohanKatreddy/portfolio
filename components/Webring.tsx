"use client";

import { useEffect, useRef, useState } from "react";
import { WEBRING } from "@/content/contact";
import styles from "./ContactRow.module.css";

type Member = { id: string; name: string; website: string };

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {dir === "left" ? <path d="M16 10H4M9 5l-5 5 5 5" /> : <path d="M4 10h12M11 5l5 5-5 5" />}
    </svg>
  );
}

/**
 * uwaterloo.network webring, drawn in the site's own style instead of the
 * stock embed so it follows Night/Day. Same behaviour as the official
 * widget: the centre icon links to the webring, and the arrows step through
 * this member's connections (from a random start) and open their sites.
 */
export default function Webring() {
  const [members, setMembers] = useState<Member[]>([]);
  const index = useRef(0);

  useEffect(() => {
    let live = true;
    fetch(`${WEBRING.base}/api/webring?user=${encodeURIComponent(WEBRING.id)}`)
      .then((r) => r.json())
      .then((data: { members?: Member[] }) => {
        if (!live || !data.members?.length) return;
        index.current = Math.floor(Math.random() * data.members.length);
        setMembers(data.members);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  const go = (step: number) => {
    if (!members.length) return;
    index.current = (index.current + step + members.length) % members.length;
    window.open(members[index.current].website, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={styles.webring}>
      <button
        type="button"
        className={styles.icon}
        onClick={() => go(-1)}
        disabled={!members.length}
        aria-label="Previous site in the Waterloo webring"
      >
        <Arrow dir="left" />
      </button>
      <a
        href={`${WEBRING.base}?ref=${encodeURIComponent(WEBRING.id)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.icon}
        aria-label="uwaterloo.network webring"
        title="uwaterloo.network"
      >
        <span aria-hidden="true" className={styles.ringIcon} style={{ ["--ring-icon" as string]: `url(${WEBRING.base}/icon.svg)` }} />
      </a>
      <button
        type="button"
        className={styles.icon}
        onClick={() => go(1)}
        disabled={!members.length}
        aria-label="Next site in the Waterloo webring"
      >
        <Arrow dir="right" />
      </button>
    </div>
  );
}
