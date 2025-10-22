import { BlinkitLocationSearch } from "@/components/BlinkitLocationSearch";
import Link from "next/link";

export default function BlinkitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="pt-8 pb-4">
          <Link 
            href="/services"
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors bg-black/20 backdrop-blur-sm border border-orange-400/30 rounded-lg px-4 py-2 hover:bg-black/40 w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </Link>
        </div>
        
        <BlinkitLocationSearch />
      </div>
    </div>
  );
}
