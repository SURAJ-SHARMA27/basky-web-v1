import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export function BackgroundBeamsWithCollisionDemo({ children }: { children?: React.ReactNode }) {
  return (
    <BackgroundBeamsWithCollision>
      {children}
    </BackgroundBeamsWithCollision>
  );
}
