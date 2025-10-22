"use client";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export function TextGenerateEffectDemo({ words }: { words: string }) {
  return (
    <TextGenerateEffect
      words={words}
      className="font-normal text-base md:text-lg"
      duration={1.2}
    />
  );
}
