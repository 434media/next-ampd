"use client"

import { motion } from "motion/react"
import { useInView } from "react-intersection-observer"

export const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 10 },
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

  return (
    <section id="about" className="py-24 md:py-32 lg:py-40">
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
              Our Mission
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8">
                The Art, Music, Photography/Film, and Design (AMPD) Project is a veteran-founded 501(c)(3) non-profit
                organization. We are dedicated to empowering students and veterans through their passion for media and
                entertainment production.
              </p>
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-6">
                Our focus is on leveraging these creative fields as catalysts for:
              </p>
              <ul className="list-disc list-inside text-lg md:text-xl text-gray-200 leading-relaxed space-y-4 ml-4">
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Educational access
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Career development
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  Entrepreneurial opportunities
                </motion.li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

