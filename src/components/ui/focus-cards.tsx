"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type CardType = {
  title: string;
  src: string;
  description?: string;
  onClick?: () => void;
};

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: CardType;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      onClick={card.onClick}
      className={cn(
        "rounded-xl relative bg-gradient-to-br from-neutral-900 to-neutral-800 overflow-hidden h-48 md:h-56 w-full transition-all duration-300 ease-out cursor-pointer border border-neutral-700 hover:border-neutral-600",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]",
        hovered === index && "scale-[1.02] shadow-2xl shadow-neutral-900/50"
      )}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 md:w-28 md:h-28 mb-4 flex items-center justify-center relative">
          <Image
            src={card.src}
            alt={card.title}
            fill
            className="object-contain"
          />
        </div>
        <div className={cn(
          "text-lg md:text-xl font-semibold text-white text-center transition-all duration-300",
          hovered === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          {card.title}
        </div>
        {card.description && (
          <div className={cn(
            "text-sm text-neutral-400 text-center mt-2 transition-all duration-300",
            hovered === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}>
            {card.description}
          </div>
        )}
      </div>
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  )
);

Card.displayName = "Card";

export function FocusCards({ cards }: { cards: CardType[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto md:px-8 w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
