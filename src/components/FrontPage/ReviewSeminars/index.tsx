import React from "react"

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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="space-y-4">
              <h3 className="text-gray-02 text-2xl font-bold mb-4">Past Review Seminars</h3>
              <div className="bg-gray-70 rounded-lg p-6 h-32"></div>
              <div className="bg-gray-70 rounded-lg p-6 h-32"></div>
              <div className="bg-gray-70 rounded-lg p-6 h-32"></div>
            </div>
          </div>

          <div className="flex-1 lg:max-w-md">
            <div className="w-full h-96 lg:h-full bg-gray-70 rounded-lg flex items-center justify-center">
              <span className="text-gray-30 text-sm uppercase">Image Placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

