"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

// Extend the Window interface to include the turnstile property
declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => string;
      getResponse: (widgetId: string) => string | null;
      reset: (widgetId: string) => void;
    };
  }
}

const isDevelopment = process.env.NODE_ENV === "development"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const [turnstileWidget, setTurnstileWidget] = useState<string | null>(null)

  useEffect(() => {
    if (!isDevelopment && !window.turnstile) {
      const script = document.createElement("script")
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
      script.async = true
      script.defer = true
      document.body.appendChild(script)

      script.onload = () => {
        if (window.turnstile && turnstileRef.current && !turnstileWidget) {
          const widgetId = window.turnstile.render(turnstileRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
            callback: (token: string) => {
              console.log("Turnstile token:", token)
            },
          })
          setTurnstileWidget(widgetId)
        }
      }

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [turnstileWidget])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      let turnstileResponse = undefined

      if (!isDevelopment) {
        if (!window.turnstile || !turnstileWidget) {
          throw new Error("Turnstile is not initialized")
        }

        turnstileResponse = window.turnstile.getResponse(turnstileWidget)
        if (!turnstileResponse) {
          throw new Error("Failed to get Turnstile response")
        }
      }

      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(turnstileResponse && { "cf-turnstile-response": turnstileResponse }),
        },
        body: JSON.stringify({ email }),
      })

      const responseData = await response.json()

      if (response.ok) {
        setEmail("")
        setIsSuccess(true)
        setTimeout(() => setIsSuccess(false), 5000) // Reset success state after 5 seconds
        if (!isDevelopment && turnstileWidget) {
          if (window.turnstile) {
            window.turnstile.reset(turnstileWidget)
          }
        }
      } else {
        throw new Error(responseData.error || "Newsletter subscription failed")
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      setError(`An error occurred: ${error instanceof Error ? error.message : String(error)}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-medium mb-3">Subscribe to our newsletter</h2>
      <p className="text-gray-400 text-lg mb-6">Stay updated on new releases and features, guides, and case studies.</p>
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="subscribe-form"
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
          >
            <div>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white font-mono text-sm placeholder:text-gray-500"
              />
            </div>
            {!isDevelopment && <div ref={turnstileRef} data-size="flexible" className="w-full" />}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/10 text-emerald-300 px-4 py-3 rounded-lg border border-emerald-500/20"
          >
            Thanks for subscribing! Check your email to confirm.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

