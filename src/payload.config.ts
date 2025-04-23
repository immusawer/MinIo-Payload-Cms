import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import Media from './collections/Media';

import { Users } from './collections/Users'
import Process from './collections/Process'
import Clients from './collections/Clients'
import PartnerStats from './collections/PartnerStats'
import Achievements from './collections/Achievements'
import BlogPosts from './collections/BlogPosts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const allowedOrigins = [
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5173',
  'http://localhost:5173'
].filter(Boolean) as string[];

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Process, Clients, PartnerStats, Achievements, BlogPosts],
  editor: lexicalEditor(),
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  cors: allowedOrigins,
  csrf: allowedOrigins,
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