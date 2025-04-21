import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    s3Storage({
      collections: {
        [Media.slug]: {
          disableLocalStorage: true,
          prefix: 'media',
        },
      },
      bucket: process.env.MINIO_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.MINIO_ACCESS_KEY || '',
          secretAccessKey: process.env.MINIO_SECRET_KEY || '',
        },
        region: process.env.MINIO_REGION || 'us-east-1',
        endpoint: process.env.MINIO_ENDPOINT,
        forcePathStyle: true,
      },
    }),
  ],
})