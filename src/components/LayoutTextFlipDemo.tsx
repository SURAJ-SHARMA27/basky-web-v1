"use client";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { motion } from "motion/react";
import Link from "next/link";

export function LayoutTextFlipDemo() {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <motion.div className="relative flex flex-row items-center justify-center gap-2 text-center w-full min-w-fit whitespace-nowrap text-sm md:text-base">
        <LayoutTextFlip
          text="Ready to "
          words={["Explore?", "Discover?", "Save Money?", "Compare?"]}
        />
      </motion.div>
      <Link href="/services">
        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-6 py-3 cursor-pointer"
        >
          <span>Get Started</span>
        </HoverBorderGradient>
      </Link>
    </div>
  );
}
