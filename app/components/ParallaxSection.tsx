"use client"

import { type ReactNode, useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"

interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  depth?: number // Controls the 3D effect intensity
}

export const ParallaxSection = ({ children, className = "", depth = 0.1 }: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Create 3D effect with subtle transformations
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [2, 0, -2])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6])
  const perspective = 1000

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        perspective,
      }}
    >
      <motion.div
        style={{
          y: y.get() * depth,
          rotateX,
          scale,
          opacity,
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

