import { CollectionConfig } from 'payload';

const Achievements: CollectionConfig = {
  slug: 'achievements',
  labels: {
    singular: 'Achievement Stats',
    plural: 'Achievement Stats',
  },
  admin: {
    group: 'Statistics',
    description: 'Manage business achievement numbers',
  },
  fields: [
    {
      name: 'businessAdvices',
      type: 'number',
      label: 'Business Advices Given',
      required: true,
      min: 0,
      defaultValue: 500,
      admin: {
        description: 'Number shown for "Business advices given" counter',
      }
    },
    {
      name: 'excellenceAwards',
      type: 'number',
      label: 'Business Excellence Awards',
      required: true,
      min: 0,
      defaultValue: 30,
      admin: {
        description: 'Number shown for "Business Excellence awards" counter',
      }
    }
  ],
  access: {
    read: () => true, // Publicly readable
    create: () => true, // Adjust permissions as needed
    update: () => true,
  },
};

export default Achievements;