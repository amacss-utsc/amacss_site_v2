import React from "react"
import Image from "next/image"

export const ReviewSeminars: React.FC = () => {
  return (
    <section className="w-full bg-gray-80 relative px-6 lg:px-16 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:items-stretch">
          <div className="flex-1">
            <h2 className="text-gray-02 text-5xl lg:text-6xl font-bold uppercase mb-8">
              Review Seminars
            </h2>
            
            <p className="text-gray-10 text-lg mb-12 leading-relaxed">
            AMACSS offers number of academic course seminars through the school year. This includes review modules, midterm preparations, and final exam preparations. Free access is given to all AMACSS members.
            </p>

            <div className="space-y-4">
              <h3 className="text-gray-02 text-2xl font-bold mb-4">Past Review Seminars</h3>
              <a 
                href="https://youtu.be/wTvI0HOdEaA?si=ofFaEI7A9fqX711P" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-gray-70 rounded-lg p-6 hover:bg-gray-60 transition-colors"
              >
                <h4 className="text-gray-02 text-lg font-semibold mb-2">MATA22 Final Review Seminar</h4>
                <p className="text-gray-20 text-sm">Winter 2025</p>
              </a>
              <a 
                href="https://youtu.be/nKrrE8x5rLg?si=P9M8ogRctxprpJaQ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-gray-70 rounded-lg p-6 hover:bg-gray-60 transition-colors"
              >
                <h4 className="text-gray-02 text-lg font-semibold mb-2">STAB57 Final Review Seminar</h4>
                <p className="text-gray-20 text-sm">Winter 2025</p>
              </a>
              <a 
                href="https://youtu.be/xGpKZV3Fk_c?si=aMVVjkqVXvF7RkNc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-gray-70 rounded-lg p-6 hover:bg-gray-60 transition-colors"
              >
                <h4 className="text-gray-02 text-lg font-semibold mb-2">CSCC11 Midterm Review Seminar</h4>
                <p className="text-gray-20 text-sm">Winter 2025</p>
              </a>
            </div>
          </div>

          <div className="flex-1 lg:max-w-md">
            <div className="w-full h-96 lg:h-full bg-gray-70 rounded-[32px] overflow-hidden relative">
              <Image
                src="/api/media/file/review_sem.jpeg"
                alt="Review Seminars"
                fill
                className="object-cover rounded-[32px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

