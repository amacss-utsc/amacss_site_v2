import React from "react"
import Image from "next/image"

export const Lounge: React.FC = () => {
  return (
    <section className="w-full bg-gray-90 relative px-6 lg:px-16 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-gray-02 text-5xl lg:text-6xl font-bold uppercase mb-8">
          Our Lounge
        </h2>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 flex flex-col">
            <p className="text-gray-10 text-lg mb-8 leading-relaxed">
              AMACSS proudly maintains a student lounge on the south end of the 3rd floor in the 
              Sam Ibrahim Building, in which students can hang out, network, play games, and ask
               questions. We will have a snack store, a ping pong table, study spaces, board 
               games, and more! Lounge operations volunteers manage the lounge, answer questions,
               and direct students to appropriate resources.
            </p>

            <div className="text-gray-10 text-lg mb-8 leading-relaxed">
              <p className="font-semibold mb-4">What We Have</p>
              <ol className="list-decimal list-inside space-y-3 ml-2">
                <li>
                  Entertainment/gaming center, including a variety of board games, including a ping pong table.
                </li>
                <li>
                  Store stocked with common snacks and drinks for student purchase.
                </li>
              </ol>
            </div>
          </div>

          <div className="flex-1 lg:max-w-md flex items-end">
            <div className="w-full h-96 bg-gray-70 rounded-lg overflow-hidden relative">
              <Image
                src="/api/media/file/lounge_photo.jpeg"
                alt="Description"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

