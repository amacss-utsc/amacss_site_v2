import { Plugin } from "payload"

import { s3Storage } from "@payloadcms/storage-s3"

const hasS3Config = Boolean(
  process.env.S3_BUCKET &&
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY &&
  process.env.S3_REGION &&
  process.env.S3_ENDPOINT,
)

export const plugins: Plugin[] = hasS3Config
  ? [
      s3Storage({
        collections: {
          media: true,
        },
        bucket: process.env.S3_BUCKET!,
        config: {
          forcePathStyle: true,
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID!,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
          },
          region: process.env.S3_REGION!,
          endpoint: process.env.S3_ENDPOINT!,
        },
      }),
    ]
  : []
