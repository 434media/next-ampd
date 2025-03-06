import { Navbar } from "./components/Navbar"
import Hero from "./components/Hero"
import { About } from "./components/About"
import { Donate } from "./components/Donate"
import { Footer } from "./components/Footer"
import { ParallaxContainer } from "./components/ParallaxContainer"
import { ScrollLock } from "./components/ScrollLock"
import { ParallaxSection } from "./components/ParallaxSection"
import BackgroundVideo from "./components/BackgroundVideo"

export default function Home() {
  return (
    <>
      <BackgroundVideo />
      <Navbar />
      <main className="relative z-10">
        {/* Main content with parallax effects */}
        <ScrollLock duration={1.5}>
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
    </>
  )
}

