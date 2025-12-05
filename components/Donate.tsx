"use client"

import { motion } from "motion/react"
import { useInView } from "react-intersection-observer"
import Link from "next/link"

export const Donate = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
      },
    },
  }

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.5,
      },
    }),
  }

  return (
    <section id="donate" className="py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          className="mx-auto max-w-4xl relative z-20 backdrop-blur-sm bg-emerald-300/5 border border-emerald-500/10 rounded-lg overflow-hidden shadow-xl"
          variants={cardVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          <div className="mx-auto max-w-3xl p-8 md:p-12">
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-400 mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Invest in Creative Futures
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8">
                Your donation to the AMPD Project directly supports our mission to provide educational opportunities and
                career development for students and veterans in the arts and media industries.
              </p>
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-6">
                By contributing, you&apos;re helping to:
              </p>
              <ul className="list-disc list-inside text-lg md:text-xl text-gray-200 leading-relaxed mb-10 space-y-4 ml-4">
                {[
                  "Fund scholarships for aspiring artists and media professionals",
                  "Provide state-of-the-art equipment and resources",
                  "Organize workshops and mentorship programs",
                  "Support entrepreneurial initiatives in creative fields",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    custom={i}
                    variants={listItemVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
              <div className="flex justify-center">
                <Link
                  href="https://buy.stripe.com/28o6oSabocgU8jC5kk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-emerald-600 text-white text-xl font-semibold rounded-md hover:bg-emerald-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg"
                  >
                    Donate Now
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

