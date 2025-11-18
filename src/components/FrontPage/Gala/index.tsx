"use client"
import React, { useState } from "react"
import Image from "next/image"

export const Gala: React.FC = () => {
  const images = [
    "/api/media/file/gala1.JPG",
    "/api/media/file/gala2.jpeg",
    "/api/media/file/gala3.jpg",
    "/api/media/file/gala4.JPG",
    "/api/media/file/gala5.jpg",
  ]
  
  const [currentImage, setCurrentImage] = useState(0)

  return (
    <section className="w-full bg-gray-90 relative px-6 lg:px-16 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-gray-02 text-5xl lg:text-6xl font-bold uppercase mb-8">
          CMS Gala
        </h2>
        
        <p className="text-gray-10 text-lg mb-12 leading-relaxed max-w-3xl">
          Celebrate student and teacher excellence at the CMS Gala, an evening of elegance, recognition, and unforgettable memories.
        </p>

        <div className="w-full h-[500px] bg-gray-70 rounded-[32px] mb-6 relative overflow-hidden">
          <Image
            src={images[currentImage]}
            alt={`Gala photo ${currentImage + 1}`}
            fill
            className="object-cover rounded-[32px]"
          />
          
          <button
            onClick={() => setCurrentImage((currentImage - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-80 text-gray-02 px-4 py-2 rounded-lg hover:bg-gray-60 transition-colors z-10"
          >
            ←
          </button>
          
          <button
            onClick={() => setCurrentImage((currentImage + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-80 text-gray-02 px-4 py-2 rounded-lg hover:bg-gray-60 transition-colors z-10"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`aspect-video bg-gray-70 rounded-[32px] relative overflow-hidden transition-all ${
                currentImage === i ? "ring-2 ring-blue-20" : "hover:ring-1 hover:ring-gray-50"
              }`}
            >
              <Image
                src={url}
                alt={`Gala thumbnail ${i + 1}`}
                fill
                className="object-cover rounded-[32px]"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

