import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2c3e50]/20 via-black to-[#4ca1af]/20" />
        <motion.div
          className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#4ca1af]/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#2c3e50]/10 rounded-full blur-3xl"
          animate={{
            x: -mousePosition.x,
            y: -mousePosition.y,
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-sm"
      >
        <Link to="/">
          <motion.div
            className="text-xl md:text-2xl font-bold"
            whileHover={{ scale: 1.05 }}
          >
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              IdeaLink
            </span>
          </motion.div>
        </Link>

        <div className="flex gap-8 items-center">
          <motion.a
            href="#about"
            className="text-sm md:text-base text-gray-400 hover:text-white transition-colors hidden md:block"
            whileHover={{ y: -2 }}
          >
            About
          </motion.a>
          <motion.a
            href="#features"
            className="text-sm md:text-base text-gray-400 hover:text-white transition-colors hidden md:block"
            whileHover={{ y: -2 }}
          >
            Features
          </motion.a>
          <Link to="/login">
            <motion.button
              className="px-4 py-2 border border-gray-700 rounded-full text-xs md:text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </Link>
          <Link to="/signup">
            <motion.button
              className="px-6 py-2 bg-gradient-to-r from-[#4ca1af] to-[#2c3e50] rounded-full text-xs md:text-sm font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ opacity }}
        className="relative min-h-screen flex items-center justify-center px-8"
      >
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              style={{
                transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
              }}
            >
              <span className="block">Transform</span>
              <span className="block bg-gradient-to-r from-[#4ca1af] via-[#3d8da7] to-[#2c3e50] bg-clip-text text-transparent">
                Ideas Into
              </span>
              <span className="block">Reality</span>
            </motion.h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-base md:text-lg text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            Connect innovative minds with visionary investors. Build the future together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex gap-4 md:gap-6 justify-center"
          >
            <Link to="/signup">
              <motion.button
                className="px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-full font-semibold text-sm md:text-base"
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,255,255,0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Ideas
              </motion.button>
            </Link>
            <Link to="/signup">
              <motion.button
                className="px-6 md:px-8 py-3 md:py-4 border border-white/20 rounded-full font-semibold text-sm md:text-base backdrop-blur-sm"
                whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                Submit Idea
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-24 h-24 md:w-32 md:h-32 border border-[#4ca1af]/30 rounded-full"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-20 h-20 md:w-24 md:h-24 border border-[#2c3e50]/30 rounded-lg"
          animate={{
            y: [0, 30, 0],
            rotate: [0, -180, -360],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-9 md:w-6 md:h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1 h-2 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* About Section with Parallax */}
      <section id="about" className="relative min-h-screen flex items-center justify-center px-8 py-24 md:py-32">
        <motion.div
          style={{ y: y1 }}
          className="max-w-5xl mx-auto relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">
              <span className="bg-gradient-to-r from-[#4ca1af] to-[#2c3e50] bg-clip-text text-transparent">
                What is IdeaLink?
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed">
              A revolutionary platform connecting innovators with investors. 
              We bridge the gap between groundbreaking ideas and the capital needed to bring them to life.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative min-h-screen px-8 py-24 md:py-32">
        <motion.div
          style={{ y: y2 }}
          className="max-w-7xl mx-auto relative z-10"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-14 md:mb-20"
          >
            Features
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Submit Ideas', desc: 'Share your innovative concepts with potential investors worldwide' },
              { title: 'Connect', desc: 'Build meaningful relationships with investors who believe in your vision' },
              { title: 'Collaborate', desc: 'Work together to transform ideas into successful ventures' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="p-6 md:p-8 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-white/30 transition-colors cursor-pointer group"
              >
                <motion.div
                  className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#4ca1af] to-[#2c3e50] rounded-xl mb-4 md:mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                />
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 group-hover:text-[#4ca1af] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 md:py-32 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 md:gap-16 text-center">
          {[
            { number: '10', label: 'Ideas Shared' },
            { number: '7', label: 'Active Investors' },
            { number: '$0', label: 'Funding Raised' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.h3
                className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-[#4ca1af] to-[#2c3e50] bg-clip-text text-transparent"
                whileInView={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {stat.number}
              </motion.h3>
              <p className="text-sm md:text-base text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 md:mb-8"
          >
            Ready to Start?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-gray-400 mb-10 md:mb-12"
          >
            Join the community and transform your ideas into reality
          </motion.p>
          <Link to="/signup">
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              viewport={{ once: true }}
              className="px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-[#4ca1af] to-[#2c3e50] rounded-full text-base md:text-lg font-semibold"
              whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(76, 161, 175, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 px-8 py-10 md:py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs md:text-sm text-gray-500">
            © 2025 IdeaLink. All rights reserved.
          </p>
          <div className="flex gap-4 md:gap-6">
            <a href="#" className="text-xs md:text-sm text-gray-500 hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="text-xs md:text-sm text-gray-500 hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-xs md:text-sm text-gray-500 hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}