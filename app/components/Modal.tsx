"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Dialog, DialogPanel } from "@headlessui/react"
import { XCircleIcon } from "@heroicons/react/20/solid"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  videoSrc: string
}

export function Modal({ isOpen, onClose, videoSrc }: ModalProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      closeButtonRef.current?.focus()
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleVideoLoad = () => {
    setIsVideoLoaded(true)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          open={isOpen}
          onClose={onClose}
          initialFocus={closeButtonRef}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <DialogPanel
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
            >

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
              &#8203;
            </span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="inline-block w-full max-w-4xl transform overflow-hidden rounded-lg bg-gray-900 text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle"
            >
              <div className="absolute right-0 top-0 pr-4 pt-4 sm:block">
                <button
                  ref={closeButtonRef}
                  type="button"
                  className="rounded-md bg-gray-900 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <span className="sr-only">Close</span>
                  <XCircleIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="w-full">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white sr-only">
                      Video Player
                    </Dialog.Title>
                    <div className="mt-2 relative" style={{ paddingBottom: "56.25%", height: 0 }}>
                      {!isVideoLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
                        </div>
                      )}
                      <video
                        ref={videoRef}
                        className={`absolute top-0 left-0 w-full h-full ${isVideoLoaded ? "opacity-100" : "opacity-0"}`}
                        src={videoSrc}
                        controls
                        autoPlay
                        playsInline
                        onLoadedData={handleVideoLoad}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

