// src/components/homepage/HeroSection.tsx
export default function HeroSection() {
  return (
    <section className="w-full py-24 bg-gray-900 text-white text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Welcome to My Personal Blog
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
        I share projects, ideas, tutorials, and everything I learn as a developer.
      </p>

      <div className="mt-8">
        <a
          href="#features"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold"
        >
          Explore Features
        </a>
      </div>
    </section>
  );
}
