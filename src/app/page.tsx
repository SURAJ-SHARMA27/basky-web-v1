
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { PixelatedCanvasDemo } from "@/components/PixelatedCanvasDemo";
import { SparklesPreview } from "@/components/SparklesPreview";
import { TextGenerateEffectDemo } from "@/components/TextGenerateEffectDemo";
import { LayoutTextFlipDemo } from "@/components/LayoutTextFlipDemo";

export default function Home() {
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(5, 5, 5)"
      gradientBackgroundEnd="rgb(0, 0, 0)"
      firstColor="30, 60, 40"
      secondColor="60, 30, 30"
      thirdColor="25, 50, 35"
      fourthColor="50, 25, 25"
      fifthColor="20, 40, 30"
      pointerColor="40, 60, 50"
      size="70%"
      blendingValue="soft-light"
    >
      <div className="absolute z-50 inset-0 flex flex-col md:flex-row items-center justify-center min-h-screen w-full gap-4 md:gap-8 px-4 md:px-10 py-8 md:py-0">
        {/* Left: App name and description with animated heading */}
        <div className="flex-1 max-w-xl w-full text-center p-4 md:p-10">
          <SparklesPreview headingClassName="text-3xl sm:text-4xl md:text-5xl lg:text-7xl" />
          <div className="mb-4 md:mb-6 mt-3 md:mt-4">
            <TextGenerateEffectDemo
              words={
                `Basky helps you compare prices and availability of groceries across Zepto, Blinkit, and Swiggy Instamart.`
              }
            />
          </div>
          <LayoutTextFlipDemo />
        </div>
        {/* Right: Pixelated Canvas Demo */}
        <div className="flex-1 flex items-center justify-center w-full min-h-[200px] md:min-h-[400px]">
          <PixelatedCanvasDemo />
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
}
