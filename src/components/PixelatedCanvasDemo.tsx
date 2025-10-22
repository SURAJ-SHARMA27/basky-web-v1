"use client";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";

export function PixelatedCanvasDemo() {
  return (
    <div className="mx-auto mt-8">
      <PixelatedCanvas
        src="/basky.png"
        width={400}
        height={500}
        cellSize={2}
        dotScale={1}
        shape="square"
        backgroundColor="#000000ff"
        dropoutStrength={0.15}
        interactive
        distortionStrength={10}
        distortionRadius={50}
        distortionMode="swirl"
        followSpeed={0.4}
        jitterStrength={2}
        jitterSpeed={2}
        sampleAverage
        tintColor="#000000ff"
        tintStrength={0.1}
        className="rounded-xl border border-neutral-800 shadow-lg"
      />
    </div>
  );
}
