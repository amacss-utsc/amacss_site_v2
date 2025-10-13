import React from "react"

export const Colloquium: React.FC = () => {
  return (
    <section className="w-full min-h-screen bg-gray-90 relative px-6 lg:px-16 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-gray-02 text-5xl lg:text-6xl font-bold uppercase mb-8">
          Colloquium
        </h2>
        
        <p className="text-gray-10 text-lg mb-12 leading-relaxed max-w-3xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-70 rounded-lg overflow-hidden">
              <div className="w-full h-48 bg-gray-60 flex items-center justify-center">
                <span className="text-gray-30 text-sm">Speaker Photo {i}</span>
              </div>
              <div className="p-6">
                <h3 className="text-gray-02 text-xl font-bold mb-2">Talk Title {i}</h3>
                <p className="text-gray-10 text-sm">Speaker Name</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

