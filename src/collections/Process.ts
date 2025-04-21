// src/collections/Process.ts
import { CollectionConfig } from 'payload';

export const Process: CollectionConfig = {
  slug: 'process',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'steps', 'activeClass'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
    {
      name: 'steps',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Upload the process step image',
      },
    },
    {
      name: 'activeClass',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: '' },
      ],
      defaultValue: '',
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first',
      },
    },
  ],
};

export default Process;