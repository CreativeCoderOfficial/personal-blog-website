import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="
      relative 
      min-h-screen 
      flex items-center 
      /* PADDING: 
         - 'pt-20 pb-20' on mobile
         - 'lg:pt-32 lg:pb-32' on laptops to fix 'no padding' feel
      */
      pt-20 pb-20 lg:pt-32 lg:pb-32 2xl:py-40
      overflow-hidden 
      bg-main
    ">
      
      {/* BACKGROUND BLOB */}
      <div 
        className="
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          w-[600px] h-[600px] 2xl:w-[1200px] 2xl:h-[1200px]
          bg-accent-purple/10 
          rounded-full blur-[100px] 2xl:blur-[120px]
          pointer-events-none
        " 
      />

      {/* CONTAINER FIXES:
         1. removed 'container': The default Tailwind container is too narrow for huge monitors.
         2. w-full max-w-[...] mx-auto: We manually set the max-width.
            - max-w-7xl: Standard width for laptops.
            - 2xl:max-w-[1800px]: Allows content to spread WIDE on monitors.
         3. Padding (px):
            - lg:px-16: Gives laptop screens that missing side padding.
            - 2xl:px-24: Comfortable edges on huge screens.
      */}
      <div className="w-full max-w-7xl 2xl:max-w-[1800px] mx-auto px-6 lg:px-16 2xl:px-24 relative z-10">
        
        <div className="
          grid lg:grid-cols-2 
          items-center
          /* GAP FIXES: 
             - lg:gap-12: Tighter on laptops so images aren't pushed off.
             - 2xl:gap-32: Huge gap on monitors to stop the 'wedged' look.
          */
          gap-12 2xl:gap-32
        ">
          
          {/* LEFT COLUMN: Text Content */}
          <div className="max-w-2xl 2xl:max-w-4xl">
            <h1 className="
              /* TEXT SIZING FIX:
                 - text-5xl: Mobile.
                 - lg:text-6xl: Laptops (Was 7xl, which was too big).
                 - 2xl:text-8xl: Monitors (Kept massive).
              */
              text-5xl lg:text-6xl 2xl:text-8xl 
              font-bold tracking-tight text-text-primary 
              leading-tight mb-6 2xl:mb-10
            ">
              Building digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-pink">
                experiences
              </span>
              <br /> that matter.
            </h1>

            <p className="
              /* Subtext sizing */
              text-lg lg:text-xl 2xl:text-2xl 
              text-text-secondary 
              max-w-lg 2xl:max-w-2xl 
              mb-8 2xl:mb-12 
              leading-relaxed
            ">
              I'm Max, a Full Stack Developer. I combine technical expertise with creative design to build scalable, user-centric web applications.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                href="/blogs"
                className="
                  group
                  /* Button Sizing */
                  px-8 py-3 lg:px-8 lg:py-4 2xl:px-12 2xl:py-6
                  rounded-full font-bold text-white 
                  text-sm lg:text-base 2xl:text-xl
                  bg-gradient-to-r from-accent-orange to-accent-pink
                  hover:shadow-lg hover:shadow-accent-orange/20
                  transition-all duration-300
                  flex items-center gap-2
                "
              >
                Read My Blogs
                <ArrowRight className="w-4 h-4 2xl:w-6 2xl:h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/about"
                className="
                  px-8 py-3 lg:px-8 lg:py-4 2xl:px-12 2xl:py-6
                  rounded-full font-bold text-text-primary 
                  text-sm lg:text-base 2xl:text-xl
                  border border-border-subtle bg-white/5
                  hover:bg-white/10 hover:border-text-secondary/50
                  transition-all duration-300
                "
              >
                About Me
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Photo Collage */}
          <div className="
            relative 
            /* Height scaling */
            h-[450px] lg:h-[500px] 2xl:h-[700px] 
            w-full hidden lg:block
          ">
            
            {/* PHOTO 1: Back (Landscape) */}
            <div className="
              absolute 
              /* Positioning */
              top-16 right-4 
              lg:top-20 lg:right-8
              2xl:top-24 2xl:right-16
              /* Sizing: Smaller on Laptop (w-64), Huge on Monitor (w-[30rem]) */
              w-60 h-44 
              lg:w-72 lg:h-56 
              2xl:w-[32rem] 2xl:h-[22rem]
              bg-secondary rounded-2xl 
              shadow-2xl shadow-black/50
              rotate-6 border-4 border-white/5
              overflow-hidden
              hover:scale-105 hover:rotate-0 hover:z-20 transition-all duration-500
            ">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" 
                alt="Coding Setup" 
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* PHOTO 2: Middle (Portrait) */}
            <div className="
              absolute 
              /* Positioning */
              top-0 right-36 
              lg:right-48
              2xl:right-[24rem]
              /* Sizing */
              w-52 h-72 
              lg:w-64 lg:h-80 
              2xl:w-[24rem] 2xl:h-[34rem]
              bg-secondary rounded-2xl 
              shadow-2xl shadow-black/50
              -rotate-3 border-4 border-white/5
              overflow-hidden
              z-10
              hover:scale-105 hover:rotate-0 hover:z-20 transition-all duration-500
            ">
              <img 
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80" 
                alt="Project Work" 
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* PHOTO 3: Front (Square) */}
            <div className="
              absolute 
              /* Positioning */
              bottom-8 right-24 
              lg:bottom-10 lg:right-32
              2xl:bottom-16 2xl:right-[18rem]
              /* Sizing */
              w-44 h-44 
              lg:w-56 lg:h-56 
              2xl:w-[22rem] 2xl:h-[22rem]
              bg-secondary rounded-2xl 
              shadow-2xl shadow-black/50
              rotate-12 border-4 border-white/5
              overflow-hidden
              z-20
              hover:scale-105 hover:rotate-0 hover:z-20 transition-all duration-500
            ">
              <img 
                src="https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=800&q=80" 
                alt="Portrait" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* DECORATIVE BADGE */}
            <div className="
              absolute 
              bottom-12 right-0 
              lg:bottom-20 lg:right-0
              2xl:bottom-24 2xl:right-8
              z-30 animate-bounce
              bg-card backdrop-blur-md border border-border-subtle
              p-3 2xl:p-5 rounded-xl shadow-lg
            ">
              <span className="text-2xl 2xl:text-4xl">🚀</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}