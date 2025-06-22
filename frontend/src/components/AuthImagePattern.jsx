import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

const AuthImagePattern = ({ title, subtitle }) => {
  const gridItems = [...Array(16)].map((_, i) => ({
    id: i,
    delay: Math.random() * 0.3,
    hasIcon: i === 3 || i === 7 || i === 12 || i === 15, // Scatter icons
  }));

  // Typing animation variants for title
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      className="hidden lg:flex items-center justify-center bg-gradient-to-br from-accent/10 via-base-100 to-base-200 p-12 sm:p-16 relative overflow-hidden"
      aria-hidden="true"
    >
      {/* Animated SVG Background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="wave-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 20 Q 10 10, 20 20 T 40 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-accent/30"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wave-pattern)" />
      </svg>

      <motion.div
        className="max-w-lg text-center bg-base-100/90 backdrop-blur-lg rounded-3xl p-8 sm:p-12 shadow-xl border border-base-300/50"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Dynamic Grid Pattern */}
        <motion.div
          className="grid grid-cols-4 gap-3 sm:gap-4 mb-10"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {gridItems.map((item) => (
            <motion.div
              key={item.id}
              className={`
                aspect-square rounded-[12px] bg-gradient-to-br from-accent/30 to-accent/10
                flex items-center justify-center transition-all duration-300
                hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]
              `}
              variants={{
                hidden: { opacity: 0, scale: 0.7 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.4, delay: item.delay }}
              whileHover={{ scale: 1.15, rotate: 5 }}
            >
              {item.hasIcon && (
                <MessageSquare
                  className="size-5 text-accent/80"
                  style={{ opacity: 0.6 + Math.random() * 0.4 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Title with Typing Animation */}
        <motion.h2
          className="text-4xl sm:text-5xl font-extrabold text-accent mb-4 tracking-tight"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          {title.split("").map((char, i) => (
            <motion.span key={i} variants={letterVariants}>
              {char}
            </motion.span>
          ))}
        </motion.h2>
        <motion.p
          className="text-lg sm:text-xl text-base-content/70 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {subtitle}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AuthImagePattern;