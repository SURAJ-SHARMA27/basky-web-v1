import { FocusCardsDemo } from "@/components/FocusCardsDemo";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Choose Your Platform
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Compare prices and availability across your favorite grocery delivery platforms
          </p>
        </div>
        <FocusCardsDemo />
      </div>
    </div>
  );
}
