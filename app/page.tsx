"use client"

import { useState, useEffect } from "react"
import { Navbar } from "../components/Navbar"
import Hero from "../components/Hero"
import { About } from "../components/About"
import { Donate } from "../components/Donate"
import { Footer } from "../components/Footer"
import { ParallaxContainer } from "../components/ParallaxContainer"
import { ScrollLock } from "../components/ScrollLock"
import { ParallaxSection } from "../components/ParallaxSection"
import BackgroundVideo from "../components/BackgroundVideo"
import NewsletterPopup from "../components/NewsletterPopup"

export default function Home() {
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false)

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem("ampd-newsletter-popup-seen")

    if (!hasSeenPopup) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setShowNewsletterPopup(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClosePopup = () => {
    setShowNewsletterPopup(false)
    // Mark as seen so it doesn't show again
    localStorage.setItem("ampd-newsletter-popup-seen", "true")
  }

  return (
    <>
      <BackgroundVideo />
      <Navbar />
      <main className="relative z-10">
        {/* Main content with parallax effects */}
        <ScrollLock duration={0.2}>
          <Hero />
        </ScrollLock>

        <ParallaxSection>
          <ParallaxContainer direction="up" speed={0.1} rotateOnScroll>
            <About />
          </ParallaxContainer>
        </ParallaxSection>

        <ParallaxSection>
          <ParallaxContainer direction="up" speed={0.1} rotateOnScroll delay={0.2}>
            <Donate />
          </ParallaxContainer>
        </ParallaxSection>
      </main>
      <Footer />

      {/* Newsletter Popup */}
      <NewsletterPopup showModal={showNewsletterPopup} onClose={handleClosePopup} />
    </>
  )
}
