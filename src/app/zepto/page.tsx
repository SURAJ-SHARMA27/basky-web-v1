import { PlaceholdersAndVanishInputDemoZep } from "@/components/PlaceholdersAndVanishInputDemoZep";
import { LightGradientAnimation } from "@/components/ui/light-gradient-animation";
import Link from "next/link";

export default function ZeptoPage() {
  return (
    <main className="min-h-screen relative bg-black">
      <LightGradientAnimation
        gradientBackgroundStart="rgb(2, 8, 2)"
        gradientBackgroundEnd="rgb(8, 2, 2)"
        firstColor="80, 200, 120"
        secondColor="200, 100, 100"
        thirdColor="120, 160, 200"
        fourthColor="180, 80, 80"
        fifthColor="100, 180, 100"
        sixthColor="200, 160, 100"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
          {/* Back Button */}
          <div className="absolute top-8 left-8 z-10">
            <Link 
              href="/services"
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors bg-black/20 backdrop-blur-sm border border-green-400/30 rounded-lg px-4 py-2 hover:bg-black/40"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Services
            </Link>
          </div>
          
          <PlaceholdersAndVanishInputDemoZep />
        </div>
      </LightGradientAnimation>
    </main>
  );
}
