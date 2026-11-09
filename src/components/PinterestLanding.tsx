import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, ArrowRight, Bookmark, Sparkles, Heart, Sun, Moon } from 'lucide-react';
import { LOGO_URL } from '../types';

interface PinterestLandingProps {
  onEnterApp: () => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenDonationModal: () => void;
}

export const PinterestLanding: React.FC<PinterestLandingProps> = ({
  onEnterApp,
  onOpenLogin,
  onOpenSignup,
  isDarkMode,
  onToggleDarkMode,
  onOpenDonationModal,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const SLIDES = [
    {
      title: 'chai time snack idea',
      color: '#4A6958',
      dotColor: 'bg-[#4A6958]',
      image: '/src/assets/images/pin_chai_snack_1793629767640.jpg',
      alt: 'Chai and samosa snack',
      secondaryImages: [
        '/src/assets/images/pin_artisan_coffee_1793629065505.jpg',
        '/src/assets/images/pin_warm_interior_1793629035949.jpg',
      ],
    },
    {
      title: 'home decor idea',
      color: '#435146',
      dotColor: 'bg-[#435146]',
      image: '/src/assets/images/pin_home_decor_1793629784209.jpg',
      alt: 'Indian home decor with brass urli and marigolds',
      secondaryImages: [
        '/src/assets/images/pin_minimal_architecture_1793629020212.jpg',
        '/src/assets/images/pin_diy_craft_1793629821836.jpg',
      ],
    },
    {
      title: 'outfit idea',
      color: '#1B2922',
      dotColor: 'bg-[#1B2922]',
      image: '/src/assets/images/pin_outfit_inspo_1793629801112.jpg',
      alt: 'Contemporary Indian kurta and jhumkas street styling',
      secondaryImages: [
        '/src/assets/images/pin_editorial_fashion_1793629050559.jpg',
        '/src/assets/images/pin_coastal_landscape_1793629081733.jpg',
      ],
    },
    {
      title: 'DIY project idea',
      color: '#5B826D',
      dotColor: 'bg-[#5B826D]',
      image: '/src/assets/images/pin_diy_craft_1793629821836.jpg',
      alt: 'Terracotta painted pots workshop',
      secondaryImages: [
        '/src/assets/images/pin_home_decor_1793629784209.jpg',
        '/src/assets/images/pin_artisan_coffee_1793629065505.jpg',
      ],
    },
  ];

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [SLIDES.length]);

  const currentSlide = SLIDES[activeSlide];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F4] dark:bg-[#121D18] text-[#1C1C1C] dark:text-[#EDF2EE] font-sans selection:bg-[#4A6958]/25 selection:text-[#4A6958] transition-colors overflow-x-hidden">
      {/* Official Encript Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#1B2922]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-[#D6DFD8] dark:border-[#273A31] transition-colors">
        <div className="flex items-center gap-6 shrink-0">
          {/* Encript Official Logo & Wordmark */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer focus:outline-none group"
            title="Encript"
          >
            <img
              src={LOGO_URL}
              alt="Encript Logo"
              className="w-10 h-10 rounded-full object-cover shadow-xs ring-1 ring-[#D6DFD8] dark:ring-[#273A31] group-hover:scale-105 transition-transform"
            />
            <span className="text-2xl font-bold tracking-tight text-[#1C1C1C] dark:text-white font-sans">
              Encript
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#1C1C1C] dark:text-[#EDF2EE]">
            <button
              onClick={onEnterApp}
              className="hover:text-[#4A6958] dark:hover:text-[#8FA597] transition-colors cursor-pointer"
            >
              Watch
            </button>
            <button
              onClick={onEnterApp}
              className="hover:text-[#4A6958] dark:hover:text-[#8FA597] transition-colors cursor-pointer"
            >
              Explore
            </button>
          </nav>
        </div>

        {/* Center: Dedicated Support Button in the empty middle space of the header */}
        <div className="flex-1 flex items-center justify-center px-2">
          <button
            onClick={onOpenDonationModal}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 bg-[#E8EDE9] hover:bg-[#D6DFD8] dark:bg-[#1F3028] dark:hover:bg-[#273A31] text-[#4A6958] dark:text-[#8FA597] text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer shadow-xs border border-[#4A6958]/35 hover:scale-105 active:scale-95"
            title="Donate via UPI QR (Rupees ₹)"
          >
            <Heart className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-[#4A6958]" />
            <span>Support ₹</span>
          </button>
        </div>

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#435146] dark:text-[#8FA597] mr-2">
            <a href="#about" className="hover:underline">About</a>
            <a href="#business" className="hover:underline">Business</a>
            <a href="#blog" className="hover:underline">Blog</a>
          </nav>

          {/* Dark Mode Option in the Bar */}
          <button
            onClick={onToggleDarkMode}
            className="w-10 h-10 rounded-full hover:bg-[#E8EDE9] dark:hover:bg-[#273A31] text-[#435146] dark:text-[#8FA597] flex items-center justify-center cursor-pointer transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-[#435146] dark:text-[#8FA597]" />
            )}
          </button>

          <button
            onClick={onOpenLogin}
            className="px-4 py-2.5 bg-[#4A6958] hover:bg-[#3D5849] text-white text-xs sm:text-sm font-bold rounded-full transition-colors cursor-pointer shadow-xs"
          >
            Log in
          </button>

          <button
            onClick={onOpenSignup}
            className="px-4 py-2.5 bg-[#E8EDE9] hover:bg-[#D6DFD8] dark:bg-[#1B2922] dark:hover:bg-[#273A31] text-[#1C1C1C] dark:text-[#EDF2EE] text-xs sm:text-sm font-bold rounded-full transition-colors cursor-pointer border border-[#D6DFD8] dark:border-[#273A31]"
          >
            Sign up
          </button>

          <button
            onClick={onEnterApp}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 border border-[#D6DFD8] dark:border-[#273A31] hover:border-[#4A6958] text-[#1C1C1C] dark:text-[#EDF2EE] text-xs font-semibold rounded-full transition-colors cursor-pointer ml-1"
            title="Jump directly to Home Feed"
          >
            <span>Feed App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section: "Get your next [idea]" */}
      <section className="relative min-h-[calc(100vh-68px)] flex flex-col justify-between items-center text-center px-4 pt-10 pb-6 overflow-hidden">
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 leading-tight">
            Get your next
          </h1>

          {/* Animated Changing Idea Headline */}
          <div className="h-16 sm:h-20 flex items-center justify-center mt-2">
            <p
              key={currentSlide.title}
              style={{ color: currentSlide.color }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-3 duration-500"
            >
              {currentSlide.title}
            </p>
          </div>

          {/* 4 Colored Indicator Dots */}
          <div className="flex items-center justify-center gap-2.5 mt-5">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.title}
                onClick={() => setActiveSlide(index)}
                aria-label={slide.title}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlide === index
                    ? `${slide.dotColor} scale-135`
                    : 'bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Visual Cascade Gallery */}
        <div className="w-full max-w-6xl mx-auto my-8 sm:my-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-7 md:gap-8 lg:gap-10 items-center justify-center px-4">
          {/* Card 1 */}
          <div className="hidden md:block transform -translate-y-2 transition-transform duration-700">
            <img
              src={currentSlide.secondaryImages[0]}
              alt="Related pin idea"
              referrerPolicy="no-referrer"
              className="w-full h-64 object-cover rounded-3xl shadow-lg hover:scale-102 transition-transform"
            />
          </div>

          {/* Card 2 */}
          <div className="transform translate-y-0 md:translate-y-3 transition-transform duration-700 sm:mr-1 md:mr-2">
            <img
              src={currentSlide.secondaryImages[1]}
              alt="Related pin idea"
              referrerPolicy="no-referrer"
              className="w-full h-72 object-cover rounded-3xl shadow-lg hover:scale-102 transition-transform ring-1 ring-black/5 dark:ring-white/10"
            />
          </div>

          {/* Centerpiece Hero Card */}
          <div className="col-span-2 sm:col-span-1 transform translate-y-0 md:-translate-y-1 transition-all duration-500 my-4 sm:my-0 sm:mx-2 md:mx-3">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-4 ring-black/5 dark:ring-white/10">
              <img
                src={currentSlide.image}
                alt={currentSlide.alt}
                referrerPolicy="no-referrer"
                className="w-full h-84 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5 sm:p-6">
                <div className="text-left text-white">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                    Trending in India
                  </span>
                  <p className="text-base font-bold capitalize mt-1 leading-snug">
                    {currentSlide.title}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="transform translate-y-0 md:translate-y-3 transition-transform duration-700 sm:ml-1 md:ml-2">
            <img
              src={currentSlide.secondaryImages[0]}
              alt="Related pin idea"
              referrerPolicy="no-referrer"
              className="w-full h-72 object-cover rounded-3xl shadow-lg hover:scale-102 transition-transform"
            />
          </div>

          {/* Card 5 */}
          <div className="hidden md:block transform -translate-y-2 transition-transform duration-700">
            <img
              src={currentSlide.secondaryImages[1]}
              alt="Related pin idea"
              referrerPolicy="no-referrer"
              className="w-full h-64 object-cover rounded-3xl shadow-lg hover:scale-102 transition-transform"
            />
          </div>
        </div>

        {/* Scroll Down Trigger */}
        <div className="flex flex-col items-center gap-1.5 pb-2">
          <button
            onClick={() => scrollToSection('section-search')}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer group"
          >
            <span>Here's how it works</span>
            <ChevronDown className="w-4 h-4 text-stone-600 group-hover:translate-y-1 transition-transform animate-bounce" />
          </button>
        </div>
      </section>

      {/* Section 2: "Search for an idea" (Sage Olive Background) */}
      <section
        id="section-search"
        className="min-h-screen bg-[#E4EAE5] dark:bg-[#121D18] flex items-center justify-center px-6 py-16 transition-colors"
      >
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Text */}
          <div className="text-center md:text-left space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1B2922] dark:text-[#EDF2EE] leading-tight">
              Search for an idea
            </h2>
            <p className="text-lg sm:text-xl text-[#435146] dark:text-[#8FA597] font-medium leading-relaxed max-w-md mx-auto md:mx-0">
              What do you want to try next? Think of something you're into—like "chai time snacks" or "modern Indian decor"—and see what you find.
            </p>
            <div className="pt-2">
              <button
                onClick={onEnterApp}
                className="px-6 py-3.5 bg-[#4A6958] hover:bg-[#3D5849] text-white font-bold text-sm rounded-full transition-colors cursor-pointer shadow-md"
              >
                Explore
              </button>
            </div>
          </div>

          {/* Right Visual: Mock Interactive Search */}
          <div className="relative bg-white dark:bg-[#1B2922] rounded-[32px] p-6 shadow-xl border border-[#D6DFD8] dark:border-[#273A31] max-w-md mx-auto w-full">
            <div className="flex items-center gap-3 px-4 py-3 bg-[#E8EDE9] dark:bg-[#1F3028] rounded-full text-[#1C1C1C] dark:text-[#EDF2EE]">
              <Search className="w-5 h-5 text-[#435146] dark:text-[#8FA597]" />
              <span className="text-sm font-semibold">easy chai time snacks</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div
                onClick={onEnterApp}
                className="group cursor-pointer rounded-2xl overflow-hidden shadow-sm"
              >
                <img
                  src="/src/assets/images/pin_chai_snack_1793629767640.jpg"
                  alt="Chai snack"
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform"
                />
                <p className="text-xs font-bold text-[#1C1C1C] dark:text-[#EDF2EE] p-2 truncate">
                  Punjabi Samosas & Kadak Chai
                </p>
              </div>

              <div
                onClick={onEnterApp}
                className="group cursor-pointer rounded-2xl overflow-hidden shadow-sm"
              >
                <img
                  src="/src/assets/images/pin_artisan_coffee_1793629065505.jpg"
                  alt="Ceramic coffee"
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform"
                />
                <p className="text-xs font-bold text-[#1C1C1C] dark:text-[#EDF2EE] p-2 truncate">
                  Artisan Flat White & Treats
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: "Save ideas you like" (Forest Mist Tint) */}
      <section className="min-h-screen bg-[#DFE7E2] dark:bg-[#1B2922] flex items-center justify-center px-6 py-16 transition-colors">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Visual: Board Collages */}
          <div className="order-2 md:order-1 relative max-w-md mx-auto w-full">
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={onEnterApp}
                className="cursor-pointer bg-white dark:bg-[#121D18] rounded-3xl p-3 shadow-lg border border-[#D6DFD8] dark:border-[#273A31] transform -rotate-2 hover:rotate-0 transition-transform"
              >
                <img
                  src="/src/assets/images/pin_home_decor_1793629784209.jpg"
                  alt="Home Decor Board"
                  referrerPolicy="no-referrer"
                  className="w-full h-52 object-cover rounded-2xl"
                />
                <div className="mt-2.5 px-1">
                  <p className="text-xs font-bold text-[#1C1C1C] dark:text-[#EDF2EE]">
                    Indian Warm Decor
                  </p>
                  <p className="text-[11px] text-[#435146] dark:text-[#8FA597]">18 pins</p>
                </div>
              </div>

              <div
                onClick={onEnterApp}
                className="cursor-pointer bg-white dark:bg-[#121D18] rounded-3xl p-3 shadow-lg border border-[#D6DFD8] dark:border-[#273A31] transform rotate-3 hover:rotate-0 transition-transform mt-6"
              >
                <img
                  src="/src/assets/images/pin_outfit_inspo_1793629801112.jpg"
                  alt="Outfit Inspo Board"
                  referrerPolicy="no-referrer"
                  className="w-full h-52 object-cover rounded-2xl"
                />
                <div className="mt-2.5 px-1">
                  <p className="text-xs font-bold text-[#1C1C1C] dark:text-[#EDF2EE]">
                    Festive Fusion
                  </p>
                  <p className="text-[11px] text-[#435146] dark:text-[#8FA597]">24 pins</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div className="order-1 md:order-2 text-center md:text-left space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1B2922] dark:text-[#EDF2EE] leading-tight">
              Save ideas you like
            </h2>
            <p className="text-lg sm:text-xl text-[#435146] dark:text-[#8FA597] font-medium leading-relaxed max-w-md mx-auto md:mx-0">
              Collect your favourites so you can get back to them later. Organize moodboards for your dream home, wedding, or morning rituals.
            </p>
            <div className="pt-2">
              <button
                onClick={onEnterApp}
                className="px-6 py-3.5 bg-[#4A6958] hover:bg-[#3D5849] text-white font-bold text-sm rounded-full transition-colors cursor-pointer shadow-md"
              >
                Explore
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: "See it, make it, try it, do it" (Evergreen Soft Tone) */}
      <section className="min-h-screen bg-[#E8EDE9] dark:bg-[#15231D] flex items-center justify-center px-6 py-16 transition-colors">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1B2922] dark:text-[#EDF2EE] leading-tight">
              See it, make it, try it, do it
            </h2>
            <p className="text-lg sm:text-xl text-[#435146] dark:text-[#8FA597] font-medium leading-relaxed max-w-md mx-auto md:mx-0">
              The best part of Encript is discovering new things and ideas from creators around the world and bringing them to life.
            </p>
            <div className="pt-2">
              <button
                onClick={onEnterApp}
                className="px-6 py-3.5 bg-[#4A6958] hover:bg-[#3D5849] text-white font-bold text-sm rounded-full transition-colors cursor-pointer shadow-md"
              >
                Explore
              </button>
            </div>
          </div>

          <div className="relative rounded-[32px] overflow-hidden shadow-2xl max-w-md mx-auto w-full border border-[#D6DFD8] dark:border-[#273A31]">
            <img
              src="/src/assets/images/pin_diy_craft_1793629821836.jpg"
              alt="DIY craft creators"
              referrerPolicy="no-referrer"
              className="w-full h-[420px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8FA597]">
                Creator Spotlight
              </span>
              <p className="text-lg font-bold mt-1">
                "Encript made me realize I could turn my ceramic hobby into a studio."
              </p>
              <p className="text-xs text-[#cbd6ce] mt-1">— Kavita, Studio Potter</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Sign Up Embed Card */}
      <section className="min-h-screen bg-[#1C1C1C] text-white flex items-center justify-center px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 overflow-hidden pointer-events-none">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 transform rotate-12 scale-125">
            {[
              '/src/assets/images/pin_chai_snack_1793629767640.jpg',
              '/src/assets/images/pin_home_decor_1793629784209.jpg',
              '/src/assets/images/pin_outfit_inspo_1793629801112.jpg',
              '/src/assets/images/pin_diy_craft_1793629821836.jpg',
              '/src/assets/images/pin_minimal_architecture_1793629020212.jpg',
              '/src/assets/images/pin_warm_interior_1793629035949.jpg',
            ].map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Background gallery"
                referrerPolicy="no-referrer"
                className="rounded-2xl h-60 object-cover"
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#1B2922] text-[#1C1C1C] dark:text-[#EDF2EE] rounded-[32px] p-8 sm:p-10 shadow-2xl text-center border border-[#D6DFD8] dark:border-[#273A31]">
          <div className="w-16 h-16 mx-auto rounded-full overflow-hidden shadow-md ring-2 ring-[#D6DFD8] dark:ring-[#273A31]">
            <img
              src={LOGO_URL}
              alt="Encript Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#1C1C1C] dark:text-white">
            Sign up to get your ideas
          </h3>
          <p className="mt-1 text-xs text-[#435146] dark:text-[#8FA597]">
            Join millions of creators discovering ideas on Encript.
          </p>

          <div className="mt-6 space-y-3">
            <button
              onClick={onEnterApp}
              className="w-full py-3 bg-[#4A6958] hover:bg-[#3D5849] text-white font-bold text-sm rounded-full transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <span>Explore Encript</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenLogin}
              className="w-full py-2.5 bg-[#E8EDE9] hover:bg-[#D6DFD8] dark:bg-[#121D18] dark:hover:bg-[#1F3028] text-[#1C1C1C] dark:text-[#EDF2EE] font-semibold text-xs rounded-full transition-colors cursor-pointer border border-[#D6DFD8] dark:border-[#273A31]"
            >
              Already a user? Log in
            </button>
          </div>

          <p className="mt-5 text-[11px] text-[#435146] dark:text-[#8FA597] leading-tight">
            By signing up, you agree to Encript's Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>

      {/* Official Footer Links */}
      <footer className="bg-[#1C1C1C] text-[#8FA597] text-xs py-10 px-6 border-t border-[#273A31]">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center">
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Help</a>
          <a href="#" className="hover:text-white transition-colors">iPhone App</a>
          <a href="#" className="hover:text-white transition-colors">Android App</a>
          <a href="#" className="hover:text-white transition-colors">Users</a>
          <a href="#" className="hover:text-white transition-colors">Collections</a>
          <a href="#" className="hover:text-white transition-colors">Shopping</a>
          <a href="#" className="hover:text-white transition-colors">Today</a>
          <a href="#" className="hover:text-white transition-colors">Explore</a>
          <a href="#" className="hover:text-white transition-colors">Watch</a>
        </div>
        <div className="mt-6 text-center text-[11px] text-[#435146]">
          © 2026 Encript. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
