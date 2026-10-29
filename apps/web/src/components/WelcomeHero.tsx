import { Button, Typography } from "@heroui/react";
import { ChevronDownIcon } from "./Icons";

interface WelcomeHeroProps {
  /** Background photo; falls back to a gradient when the marketplace is empty. */
  image?: string;
  onExplore: () => void;
}

/** Full-height welcome screen shown right after sign-in; the marketplace sits below it. */
export default function WelcomeHero({ image, onExplore }: WelcomeHeroProps) {
  return (
    <section className="relative flex min-h-[calc(100vh-57px)] items-end overflow-hidden">
      {image ? (
        <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b5e20] via-[#2e7d32] to-[#0e1410]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

      <div className="relative w-full px-6 pb-20 pt-24 md:px-12">
        <div className="mx-auto w-full max-w-[1280px]">
          <Typography type="h1" weight="bold" className="max-w-3xl text-white text-4xl leading-[1.05] md:text-6xl lg:text-7xl">
            Welcome to Loop
          </Typography>
          <Typography className="mt-4 max-w-xl text-base text-white/90 md:text-xl">
            The campus marketplace where student businesses sell food, clothes, services and
            more — all in one place.
          </Typography>
          <Button
            size="lg"
            className="mt-8 bg-white px-8 text-[#1a231c] hover:bg-white/90"
            onPress={onExplore}
          >
            Explore businesses
          </Button>
        </div>
      </div>

      <button
        type="button"
        onClick={onExplore}
        className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-sm text-white/80 hover:text-white"
      >
        Scroll to explore
        <ChevronDownIcon className="animate-bounce" />
      </button>
    </section>
  );
}
