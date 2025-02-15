"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Resource } from '@/payload-types'
import { LottieBackground } from '@/components/LottieBackground'

type ResourcesPageProps = {
  resources: Resource[]
  tags: string[]
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ resources: initialResources, tags: initialTags }) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [tags, setTags] = useState<string[]>(initialTags)

  const filteredResources = resources.filter(resource => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = resource.title?.toLowerCase().startsWith(searchLower)
    
    const matchesTag = !selectedTag || 
      resource.resourceTags?.some(t => typeof t !== 'number' && t.resourceTag === selectedTag)
    
    return matchesSearch && matchesTag
  })

  return (
    <main className="pt-6 min-h-full h-full overflow-y-scroll bg-gray-90 text-gray-02 px-7 lg:px-20 lg:rounded-tl-[32px]">
      <h1 className="hidden lg:block text-4xl font-bold mb-8">Resources</h1>

      <div className="pt-16 lg:pt-0 mb-6">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-3 rounded-[16px] bg-gray-80 border-2 border-gray-60 
                   focus:border-blue-40 focus:ring-0 placeholder-gray-40 outline-none
                   transition-all duration-200"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-4 py-2 rounded-[16px] transition-colors
            ${!selectedTag ? 'bg-blue-30 text-white' : 'bg-gray-80 hover:bg-gray-75 text-gray-20'}`}
        >
          All
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-[16px] transition-colors
              ${selectedTag === tag ? 'bg-blue-30 text-white' : 'bg-gray-80 hover:bg-gray-75 text-gray-20'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource, index) => (
          <article 
            key={index}
            className="flex flex-col bg-gray-80 rounded-[32px] p-6 
                      shadow-2xl hover:shadow-3xl
                      transition-all duration-300
                      hover:-translate-y-1
                      border-2 border-transparent hover:border-blue-30/20
                      group"
          >
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap gap-2">
                {resource.resourceTags.map((tag, i) => {
                    if (typeof tag !== "number") {
                        return (
                            <span 
                              key={i}
                              className="px-2 py-1 text-sm rounded-[8px] bg-gray-90 text-gray-20"
                            >
                              {tag.resourceTag}
                            </span>
                          )
                    }
                })}
              </div>
              
              <h3 className="text-2xl font-semibold mb-4 normal-case 
                            group-hover:text-blue-30 transition-colors">
                {resource.title}
              </h3>
              <p className="text-gray-20 text-lg mb-6 normal-case 
                          group-hover:text-gray-10 transition-colors">
                {resource.description}
              </p>
            </div>
            
            <div className="mt-auto">
              <Link
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full py-3 px-6 bg-blue-30 hover:bg-blue-40 
                          text-center rounded-[16px] text-white font-bold 
                          transition-colors normal-case
                          group-hover:scale-[1.02] transform-gpu"
              >
                {resource.buttonText}
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12 text-gray-40 text-xl">
          No resources found matching your criteria
        </div>
      )}
      
      <div className="h-20" />
    </main>
  )
}