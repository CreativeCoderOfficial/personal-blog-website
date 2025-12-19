// src/components/homepage/FeaturesSection.tsx
export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="w-full py-20 bg-white text-gray-900 px-6 md:px-12"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        What You'll Find Here
      </h2>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="p-6 rounded-xl shadow-md border">
          <h3 className="text-xl font-semibold mb-3">Projects</h3>
          <p className="text-gray-600">
            In-depth breakdowns of my personal development projects.
          </p>
        </div>

        <div className="p-6 rounded-xl shadow-md border">
          <h3 className="text-xl font-semibold mb-3">Tutorials</h3>
          <p className="text-gray-600">
            Simple, clear tutorials on React, Next.js, and full-stack dev.
          </p>
        </div>

        <div className="p-6 rounded-xl shadow-md border">
          <h3 className="text-xl font-semibold mb-3">Articles</h3>
          <p className="text-gray-600">
            Deep dives into tech topics, tools, and real-world experiences.
          </p>
        </div>
      </div>
    </section>
  );
}
