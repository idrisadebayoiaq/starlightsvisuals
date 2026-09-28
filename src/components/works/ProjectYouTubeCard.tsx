import { Play } from "lucide-react";

type ProjectYouTubeCardProps = {
  videoId: string;
  poster: string;
};

export function ProjectYouTubeCard({ poster }: ProjectYouTubeCardProps) {
  return (
    <div className="absolute inset-0">
      <img
        src={poster}
        alt=""
        className="absolute inset-0 h-full w-full bg-card object-cover object-center transition duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/20 transition group-hover:bg-background/10"
        aria-hidden
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-foreground/30 bg-background/80 backdrop-blur-sm transition group-hover:border-neon-green group-hover:text-neon-green">
          <Play className="h-6 w-6 fill-current pl-0.5" />
        </span>
      </div>
    </div>
  );
}
