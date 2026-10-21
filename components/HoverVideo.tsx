"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ProjectCard.module.css";

/** On touch screens the clip plays while the card crosses this middle band of the screen. */
const CENTER_BAND = "-40% 0px -40% 0px";

/**
 * Muted clip that plays over a project card's drawing and pauses (keeping
 * its place) when it stops being the focus:
 * - mouse/pen: while the card is hovered;
 * - touch screens: while the card is in the middle of the screen
 *   (or on tap, if the visitor prefers reduced motion).
 * Nothing is downloaded until the first play.
 */
export default function HoverVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const video = ref.current;
    const card = video?.closest("article");
    if (!video || !card) return;

    const play = () => {
      video.play().catch(() => {});
    };
    const stop = () => {
      video.pause();
      setVisible(false);
    };
    // Fade in only once frames are actually playing, so the drawing stays up while it loads.
    const onPlaying = () => setVisible(true);
    video.addEventListener("playing", onPlaying);

    const touch = window.matchMedia("(hover: none)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let detach: () => void;
    if (touch && !still) {
      const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : stop()), {
        rootMargin: CENTER_BAND,
      });
      io.observe(card);
      detach = () => io.disconnect();
    } else if (touch) {
      const onClick = () => (video.paused ? play() : stop());
      card.addEventListener("click", onClick);
      detach = () => card.removeEventListener("click", onClick);
    } else {
      const onEnter = (e: PointerEvent) => {
        if (e.pointerType !== "touch") play();
      };
      const onLeave = (e: PointerEvent) => {
        if (e.pointerType !== "touch") stop();
      };
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);
      detach = () => {
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointerleave", onLeave);
      };
    }

    return () => {
      detach();
      video.removeEventListener("playing", onPlaying);
    };
  }, []);

  return (
    <video
      ref={ref}
      className={styles.video}
      data-visible={visible || undefined}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
