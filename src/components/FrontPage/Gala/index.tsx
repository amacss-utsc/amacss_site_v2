"use client"
import React, { useState } from "react"

export const Gala: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const totalImages = 5

  return (
    <section className="w-full min-h-screen bg-gray-90 relative px-6 lg:px-16 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-gray-02 text-5xl lg:text-6xl font-bold uppercase mb-8">
          CMS Gala
        </h2>
        
        <p className="text-gray-10 text-lg mb-12 leading-relaxed max-w-3xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>

        <div className="w-full h-[500px] bg-gray-70 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
          <span className="text-gray-30 text-lg">Large Photo {currentImage + 1}</span>
          
          <button
            onClick={() => setCurrentImage((currentImage - 1 + totalImages) % totalImages)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-80 text-gray-02 px-4 py-2 rounded-lg hover:bg-gray-60 transition-colors"
          >
            ←
          </button>
          
          <button
            onClick={() => setCurrentImage((currentImage + 1) % totalImages)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-80 text-gray-02 px-4 py-2 rounded-lg hover:bg-gray-60 transition-colors"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {[...Array(totalImages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`aspect-video bg-gray-70 rounded-lg flex items-center justify-center transition-all ${
                currentImage === i ? "ring-2 ring-blue-20" : "hover:bg-gray-60"
              }`}
            >
              <span className="text-gray-30 text-sm">{i + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

