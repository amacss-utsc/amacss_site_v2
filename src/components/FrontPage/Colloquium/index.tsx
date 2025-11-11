import React from "react"
import Image from "next/image"

export const Colloquium: React.FC = () => {
  return (
    <section className="w-full bg-gray-80 relative px-6 lg:px-16 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-gray-02 text-5xl lg:text-6xl font-bold uppercase mb-8">
          Colloquium
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 lg:max-w-md flex items-start">
            <div className="w-full h-96 bg-gray-70 rounded-lg overflow-hidden relative">
              <Image
                src="/api/media/file/colloquium.jpeg"
                alt="Description"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="text-gray-10 text-lg leading-relaxed">
              <p className="mb-4">
                The Colloquium is a weekly academic and professional event series hosted by AMACSS.  
                Students, professors, and alumni are invited to sign up for a 1-hour time slot to host
                an event of their choice. Events can take the form of:
              </p>
              <ul className="list-disc list-inside space-y-2 my-4 ml-4">
                <li>Workshops</li>
                <li>Seminars</li>
                <li>Research talks</li>
                <li>Enrichment sessions on a specific topic</li>
              </ul>
              <p className="mb-4">
                You can share your current research, lead a discussion or run a workshop; the possibilities are endless!
                AMACSS will provide organizational support so you can focus on preparing and delivering your session effectively.
              </p>
              <p>
                <a href=" https://docs.google.com/forms/d/e/1FAIpQLSeSRYpGy9KRsfInqpFuybGVm9JHHIsF1n4QcAQTk1Op8JFQVg/viewform?usp=dialog" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                  Pitch your colloquium ideas!
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

