import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Sparkles, ChevronDown } from 'lucide-react';

// Rotating hero slideshow images (Unsplash CDN)
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1920&q=80', // aloe & natural skincare
  'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=1920&q=80', // spa botanicals
  'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1920&q=80', // cosmetic bottles
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1920&q=80', // cream jar
];

const SLIDE_INTERVAL = 6000;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: 'easeOut' },
  }),
};

const Hero = () => {
  const [slide, setSlide] = useState(0);

  // Auto-advance the slideshow
  useEffect(() => {
    const timer = setInterval(
      () => setSlide((s) => (s + 1) % HERO_IMAGES.length),
      SLIDE_INTERVAL
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-[92vh] w-full overflow-hidden">
      {/* Crossfading background slideshow with cinematic zoom */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-emerald-950">
        {HERO_IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Natural eco-friendly skincare"
            fetchPriority={i === 0 ? 'high' : 'low'}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
              i === slide ? 'opacity-100 animate-kenburns' : 'opacity-0'
            }`}
          />
        ))}

        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-900/50 to-emerald-900/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Floating decorative glow blobs */}
        <div className="absolute -top-16 -right-16 w-72 h-72 sm:w-96 sm:h-96 bg-emerald-400/20 rounded-full blur-3xl animate-[float_7s_ease-in-out_infinite]" />
        <div className="absolute bottom-10 right-1/4 w-56 h-56 bg-teal-300/15 rounded-full blur-3xl animate-[float_9s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 -left-20 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-[float_11s_ease-in-out_infinite]" />

        {/* Floating leaves */}
        <Leaf
          className="absolute top-24 right-[12%] text-emerald-300/40 animate-[float_6s_ease-in-out_infinite] hidden sm:block"
          size={34}
        />
        <Leaf
          className="absolute bottom-32 right-[28%] text-teal-200/30 animate-[float_8s_ease-in-out_infinite] rotate-45 hidden md:block"
          size={26}
        />
        <Sparkles
          className="absolute top-[38%] right-[8%] text-white/30 animate-[float_5s_ease-in-out_infinite] hidden sm:block"
          size={22}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-[92vh] flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            {/* Eco badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-6"
            >
              <Leaf size={16} />
              100% Eco-Friendly · Cruelty Free · Vegan
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.15}
              className="font-serif text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            >
              Skincare that loves
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                your skin & the planet
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="text-gray-200 text-base sm:text-lg md:text-xl leading-relaxed mb-8 max-w-xl"
            >
              Discover eco-friendly products matched to your unique skin type —
              take our 1-minute quiz or chat with our skincare assistant to find
              your perfect routine.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.45}
              className="flex flex-col xs:flex-row gap-3 xs:gap-4"
            >
              <Link to="/quiz" className="w-full xs:w-auto">
                <button className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-7 py-3.5 rounded-full shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]">
                  <Sparkles size={18} />
                  Know Your Skin
                </button>
              </Link>
              <Link to="/ourproducts" className="w-full xs:w-auto">
                <button className="w-full inline-flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]">
                  Shop Products
                </button>
              </Link>
            </motion.div>

            {/* Trust stats */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.6}
              className="mt-10 sm:mt-12 grid grid-cols-3 gap-4 max-w-md"
            >
              {[
                { value: '25+', label: 'Eco Products' },
                { value: '5', label: 'Skin Types' },
                { value: '4.5★', label: 'Avg. Rating' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl py-3 px-2"
                >
                  <p className="text-white text-xl sm:text-2xl font-bold">{stat.value}</p>
                  <p className="text-gray-300 text-[11px] sm:text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide indicator dots */}
      <div className="absolute bottom-6 right-5 sm:right-8 z-10 flex items-center gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`Show slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === slide
                ? 'w-7 h-2.5 bg-emerald-400'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 hidden sm:block animate-float">
        <ChevronDown className="text-white/70" size={28} />
      </div>
    </div>
  );
};

export default Hero;
