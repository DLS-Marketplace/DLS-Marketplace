interface LoopLogoProps {
  /** "wordmark" = the "loop" lettering (signed out), "mark" = the loop-shaped symbol (signed in). */
  variant: "wordmark" | "mark";
  className?: string;
}

/** Loop brand logo. Recolors with the theme: navy in light, green in dark. */
export default function LoopLogo({ variant, className = "h-8" }: LoopLogoProps) {
  return (
    <span className={`inline-flex items-center ${className}`} role="img" aria-label="Loop">
      <img
        src={`/logos/loop-${variant}-light.png`}
        alt=""
        className="logo-light-variant h-full w-auto"
      />
      <img
        src={`/logos/loop-${variant}-dark.png`}
        alt=""
        className="logo-dark-variant h-full w-auto"
      />
    </span>
  );
}
