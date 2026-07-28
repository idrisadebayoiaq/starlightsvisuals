import { useEffect, useRef, useState } from "react";

import heroVideo from "@/assets/hero-background.mp4";
import { cn } from "@/lib/utils";

type HeroBackgroundVideoProps = {
  className?: string;
};

export function HeroBackgroundVideo({ className }: HeroBackgroundVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inViewRef = useRef(true);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        inViewRef.current = entry.isIntersecting;
        setInView(entry.isIntersecting);
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = heroVideo;
    video.load();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playWithSound = () => {
      if (document.hidden || !inViewRef.current) return;

      video.muted = false;
      void video.play().catch(() => {
        video.muted = true;
        void video.play().catch(() => undefined);
      });
    };

    const syncPlayback = () => {
      if (document.hidden || !inViewRef.current) {
        video.muted = true;
        video.pause();
        return;
      }

      playWithSound();
    };

    syncPlayback();

    const unlockSound = () => {
      if (!inViewRef.current || document.hidden) return;
      playWithSound();
    };

    const onVisibility = () => syncPlayback();
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("pointerdown", unlockSound);
    document.addEventListener("keydown", unlockSound);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("pointerdown", unlockSound);
      document.removeEventListener("keydown", unlockSound);
    };
  }, [inView]);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-black", className)}
      aria-hidden
    >
      <video
        ref={videoRef}
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover opacity-100"
      />
      {/* Fixed dark scrims so light mode never washes the video with page background */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/15 lg:from-black/75 lg:via-black/30 lg:to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_20%_50%,oklch(0_0_0/0.5),transparent_65%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/25" />
    </div>
  );
}
