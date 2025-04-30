import { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

const PrivateImages: CollectionConfig = {
  slug: 'private-images',
  labels: {
    singular: 'Private Image',
    plural: 'Private Images',
  },
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'description', 'updatedAt'],
    group: 'Media',
    // Remove the custom Views if you're handling logic via hooks
  },
  upload: {
    staticDir: 'private-images',
    disableLocalStorage: true,
    mimeTypes: ['image/*'],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'filename',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'presignedUrl',
      type: 'text',
      admin: {
        hidden: false,
      },
      hooks: {
        beforeChange: [() => undefined],
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [() => undefined],
      },
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        if (req?.user?.role === 'admin') {
          try {
            const { generatePresignedUrl } = await import('../utilities/presignedUrl')
            const presignedData = await generatePresignedUrl(doc.filename, 3600)
            if (presignedData) {
              doc.presignedUrl = presignedData.url
              doc.expiresAt = presignedData.expiresAt
            }
          } catch (error) {
            console.error('Error generating presigned URL:', error)
          }
        }
        return doc
      },
    ],
    // Example: Modify query behavior before fetching list
    beforeOperation: [
      async ({ args, operation }) => {
        if (operation === 'read') {
          // Modify query logic here (e.g., enforce filters)
          args.where = { ...args.where, someCondition: true }
        }
        return args
      },
    ],
  },
}

export default PrivateImages
