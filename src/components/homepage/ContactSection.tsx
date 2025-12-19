// src/components/homepage/ContactSection.tsx
export default function ContactSection() {
  return (
    <section
      id="contact"
      className="w-full py-20 bg-gray-100 text-gray-900 px-6 md:px-12"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Get In Touch
      </h2>

      <p className="text-center text-gray-700 mb-10 max-w-xl mx-auto">
        Want to collaborate, ask questions, or just say hi?
      </p>

      <div className="flex justify-center">
        <a
          href="mailto:creativecoder.official@outlook.com"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold"
        >
          Contact Me
        </a>
      </div>
    </section>
  );
}
