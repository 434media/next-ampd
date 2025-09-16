"use client"

import { type ReactNode, useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "motion/react"

interface ScrollLockProps {
  children: ReactNode
  duration?: number // Duration of the locked scroll section in viewport heights
}

export const ScrollLock = ({ children, duration = 1 }: ScrollLockProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", `${duration * 100}vh start`],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, duration * 100])

  useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.scrollHeight)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        height: `${height}px`,
        position: "relative",
        marginBottom: `${duration * 100}vh`,
      }}
    >
      <motion.div
        style={{
          y,
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

