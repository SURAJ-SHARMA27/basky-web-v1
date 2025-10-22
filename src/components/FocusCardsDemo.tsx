"use client";

import { FocusCards } from "@/components/ui/focus-cards";
import { useRouter } from "next/navigation";

export function FocusCardsDemo() {
  const router = useRouter();

  const cards = [
    {
      title: "Zepto",
      src: "/zepto-logo.png",
      description: "10-minute delivery",
      onClick: () => router.push("/zepto"),
    },
    {
      title: "Blinkit",
      src: "/blinkit-logo.png", 
      description: "Minutes to delivery",
      onClick: () => router.push("/coming-soon"),
    },
    {
      title: "Swiggy Instamart",
      src: "/swiggy-logo.png",
      description: "Instant groceries",
      onClick: () => router.push("/coming-soon"),
    },
    {
      title: "Compare All",
      src: "/compare-icon.png",
      description: "Best prices across platforms",
      onClick: () => router.push("/coming-soon"),
    },
  ];

  return <FocusCards cards={cards} />;
}
