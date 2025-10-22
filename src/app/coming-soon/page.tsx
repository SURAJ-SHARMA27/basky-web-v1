"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ComingSoonPage() {
  useEffect(() => {
    // Load Tenor embed script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://tenor.com/embed.js';
    document.body.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <Link 
            href="/services"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-black/20 backdrop-blur-sm border border-gray-600/30 rounded-lg px-4 py-2 hover:bg-black/40"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </Link>
        </div>

        <div className="text-center max-w-2xl mx-auto">
          {/* Coming Soon GIF */}
          <div className="mb-8 flex justify-center">
            <div 
              className="tenor-gif-embed rounded-lg overflow-hidden shadow-2xl" 
              data-postid="21517225" 
              data-share-method="host" 
              data-aspect-ratio="1.50235" 
              data-width="400px"
            >
              <a href="https://tenor.com/view/coming-soon-coming-soon-its-coming-shortly-gif-21517225">
                Coming Soon Its Coming GIF
              </a>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight py-2">
            Hold Tight!
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            We&apos;re working hard to bring you this amazing feature.
            <br />
            <span className="text-blue-400 font-semibold">Coming soon!</span>
          </p>

          {/* CTA Button */}
          <Link 
            href="/services"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Explore Available Services
          </Link>
        </div>
      </div>
    </div>
  );
}
