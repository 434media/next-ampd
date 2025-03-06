"use client"

import { type ReactNode, useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"

interface ParallaxContainerProps {
  children: ReactNode
  direction?: "left" | "right" | "up" | "down"
  speed?: number
  className?: string
  rotateOnScroll?: boolean
  delay?: number
}

export const ParallaxContainer = ({
  children,
  direction = "up",
  speed = 0.2,
  className = "",
  rotateOnScroll = false,
  delay = 0,
}: ParallaxContainerProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Calculate transform values based on direction
  const transformValueLeft = useTransform(scrollYProgress, [0, 1], ["0%", `-${speed * 100}%`])
  const transformValueRight = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`])
  const transformValueUp = useTransform(scrollYProgress, [0, 1], ["0%", `-${speed * 100}%`])
  const transformValueDown = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`])

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])
  const rotateXTransform = useTransform(scrollYProgress, [0, 1], [5, -5])
  const rotateYTransform = useTransform(scrollYProgress, [0, 1], [-5, 5])
  const rotateX = rotateOnScroll ? rotateXTransform : 0
  const rotateY = rotateOnScroll ? rotateYTransform : 0
  const perspective = 1000

  const getTransformStyle = () => {
    switch (direction) {
      case "left":
        return { x: transformValueLeft }
      case "right":
        return { x: transformValueRight }
      case "up":
        return { y: transformValueUp }
      case "down":
        return { y: transformValueDown }
      default:
        return { y: transformValueUp }
    }
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        opacity,
        scale,
        perspective,
        rotateX,
        rotateY,
        ...getTransformStyle(),
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  )
}

