import { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => Boolean(data?.uploadedBy),
      },
      access: {
        update: () => false,
      },
    },
  ],
  access: {
    // Public read access (API will be accessible)
    read: () => true,

    // Only authenticated users can create via API
    create: ({ req: { user } }) => Boolean(user),

    // Update restrictions remain
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return { 'uploadedBy.value': { equals: user.id } };
    },

    // Delete restrictions remain
    delete: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return { 'uploadedBy.value': { equals: user.id } };
    },
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create') {
          return { ...data, uploadedBy: req.user?.id };
        }
        return data;
      },
    ],
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'uploadedBy', 'createdAt'],
    group: 'Content',
    // Enable API URL visibility in admin panel
    hideAPIURL: false, // Changed from 'true' to 'false'
  }}