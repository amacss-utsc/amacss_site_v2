import { Plugin } from "payload"

import { s3Storage } from "@payloadcms/storage-s3"

export const plugins: Plugin[] = [
  s3Storage({
    collections: {
      media: true,
    },
    // @ts-ignore
    bucket: process.env.S3_BUCKET,
    config: {
      forcePathStyle: true,
      credentials: {
        // @ts-ignore
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        // @ts-ignore
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
    },
  }),
]
