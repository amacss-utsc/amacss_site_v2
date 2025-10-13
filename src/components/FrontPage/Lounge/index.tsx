import React from "react"

export const Lounge: React.FC = () => {
  return (
    <section className="w-full min-h-screen bg-gray-80 relative px-6 lg:px-16 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-gray-02 text-5xl lg:text-6xl font-bold uppercase mb-8">
          Our Lounge
        </h2>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 flex flex-col">
            <p className="text-gray-10 text-lg mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <div className="grid grid-cols-3 gap-6 mt-auto">
              <div className="bg-gray-70 rounded-lg p-6 h-32 flex items-center justify-center">
                <span className="text-gray-30 text-sm">Activity 1</span>
              </div>
              <div className="bg-gray-70 rounded-lg p-6 h-32 flex items-center justify-center">
                <span className="text-gray-30 text-sm">Activity 2</span>
              </div>
              <div className="bg-gray-70 rounded-lg p-6 h-32 flex items-center justify-center">
                <span className="text-gray-30 text-sm">Activity 3</span>
              </div>
            </div>
          </div>

          <div className="flex-1 lg:max-w-md flex items-end">
            <div className="w-full h-96 bg-gray-70 rounded-lg flex items-center justify-center">
              <span className="text-gray-30 text-sm uppercase">Image Placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

