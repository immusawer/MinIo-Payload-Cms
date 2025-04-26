import { CollectionConfig } from 'payload';
import { isAdmin } from '../access/isAdmin';

const PrivateImages: CollectionConfig = {
  slug: 'private-images',
  access: {
    // Only admins can create, read, update, delete
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'filename',
    description: 'Private images accessible only via presigned URLs',
  },
  upload: {
    // Configure storage to use MinIO,
    staticDir: 'private-images',
    disableLocalStorage: true,
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    // Generate presigned URLs for admin access
    adminThumbnail: ({ doc }) => {
      // Use the presigned URL if available, otherwise fall back to the regular URL
      // Ensure we return a string, false, or null as required by the type
      if (doc.presignedUrl && typeof doc.presignedUrl === 'string') {
        return doc.presignedUrl;
      }
      
      if (doc.url && typeof doc.url === 'string') {
        return doc.url;
      }
      
      return null; // Return null if no valid URL is available
    },
  },
  fields: [
    {
      name: 'filename',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the image file',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description of the image',
      },
    },
    {
      name: 'presignedUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Presigned URL (auto-generated)',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            // Clear this field before saving
            return undefined;
          },
        ],
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'URL expiration time',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            // Clear this field before saving
            return undefined;
          },
        ],
      },
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        // Only generate presigned URLs for admin users
        if (req.user && req.user.role === 'admin') {
          // We'll implement the presigned URL generation in a separate file
          // and import it here
          const { generatePresignedUrl } = await import('../utilities/presignedUrl');
          
          // Generate a presigned URL that expires in 1 hour
          const expirationTime = 3600;
          const presignedData = await generatePresignedUrl(doc.filename, expirationTime);
          
          if (presignedData) {
            doc.presignedUrl = presignedData.url;
            doc.expiresAt = presignedData.expiresAt;
          }
        }
        
        return doc;
      },
    ],
  },
};

export default PrivateImages;