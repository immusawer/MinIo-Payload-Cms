import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      defaultValue: 'user',
      required: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ data, req: { user }, operation }) => {
            // For existing documents being updated
            if (operation === 'update') {
              // If no data provided or no role in data, keep existing role
              if (!data || !('role' in data)) {
                return undefined; // Will maintain existing value
              }
              
              // Prevent non-admins from changing roles
              if (user?.role !== 'admin' && 'role' in data) {
                throw new Error('Only admins can change roles');
              }
            }
            
            // For new documents, use defaultValue if no data provided
            return data?.role || 'user';
          },
        ],
      },
    },
  ],
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      return { id: { equals: user?.id } };
    },
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        // Ensure existing users without role are treated as admins
        if (!doc.role) {
          doc.role = 'admin';
        }
        return doc;
      },
    ],
  },
};