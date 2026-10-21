"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ProjectCard.module.css";

/**
 * Muted clip that plays over a project card's drawing while the card is
 * hovered, and pauses (keeping its place) when the pointer leaves. On
 * touch-only devices a tap on the card toggles it. Nothing is downloaded
 * until the first play.
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
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "touch") play();
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== "touch") stop();
    };
    const onClick = () => {
      if (!window.matchMedia("(hover: none)").matches) return;
      if (video.paused) play();
      else stop();
    };
    // Fade in only once frames are actually playing, so the drawing stays up while it loads.
    const onPlaying = () => setVisible(true);

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);
    card.addEventListener("click", onClick);
    video.addEventListener("playing", onPlaying);
    return () => {
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
      card.removeEventListener("click", onClick);
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
