import type { Metadata } from 'next/types'
import dynamic from 'next/dynamic'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import React from 'react'

// Dynamically import components with no SSR
const CollectionArchive = dynamic(() => import('@/components/CollectionArchive').then(mod => mod.CollectionArchive), { ssr: false })
const PageRange = dynamic(() => import('@/components/PageRange').then(mod => mod.PageRange), { ssr: false })
const Pagination = dynamic(() => import('@/components/Pagination').then(mod => mod.Pagination), { ssr: false })

export const revalidate = 600

export default async function Page() {
  let payload
  try {
    payload = await getPayloadHMR({ config: configPromise })
  } catch (error) {
    console.error('Error initializing payload:', error)
    return <div>Error initializing payload</div>
  }

  let posts
  try {
    posts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: 12,
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return <div>Error loading posts</div>
  }

  if (!posts || !posts.docs.length) {
    return <div>No posts found</div>
  }

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Payload Website Template Posts',
  }
}