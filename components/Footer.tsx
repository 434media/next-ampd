"use client"
import { Newsletter } from "./Newsletter"
import { MarqueeText } from "./MarqueeText"
import { FooterLogo } from "./FooterLogo"

export function Footer() {
  return (
    <footer className="border-t backdrop-blur-sm bg-emerald-300/5 border-emerald-500/10 relative z-10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Logo and Copyright Section */}
          <div className="space-y-6">
            <FooterLogo className="w-32 h-auto" />
            <div className="text-sm text-gray-400 space-y-2">
              <p>&copy; {new Date().getFullYear()} 434 MEDIA. All rights reserved.</p>
              <p className="md:max-w-md">
                AMPD Project is a veteran-founded 501(c)(3) non-profit organization dedicated to empowering creativity
                in media and arts.
              </p>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="md:pl-8">
            <Newsletter />
          </div>
        </div>
      </div>

      {/* Marquee Text */}
      <div className="w-full overflow-hidden py-4 border-t border-emerald-500/10">
        <MarqueeText
          text="JOIN OUR NEWSLETTER • STAY UPDATED • SUPPORT OUR MISSION • EMPOWER CREATIVITY •"
          className="text-lg font-bold"
          speed={15}
        />
      </div>
    </footer>
  )
}

