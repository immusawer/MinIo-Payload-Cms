import { CollectionConfig } from 'payload';

const PartnerStats: CollectionConfig = {
  slug: 'partner-stats',
  labels: {
    singular: 'Partner Stats', 
    plural: 'Partner Stats',
  },
  fields: [
    {
      name: 'partnerCount',
      type: 'number',
      label: 'Worldwide Partners Count',
      required: true,
      min: 0,
      defaultValue: 80,
    }
  ],
  access: {
    read: () => true,
    update: () => true,
  },
};

export default PartnerStats;