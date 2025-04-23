import { CollectionConfig } from 'payload';

const Clients: CollectionConfig = {
  slug: 'clients',
  labels: {
    singular: 'Client Stats',
    plural: 'Client Stats',
  },
  admin: {
    group: 'Statistics',
    description: 'Manage the numbers displayed in the success counters',
  },
  fields: [
    {
      name: 'consultingSuccess',
      type: 'number',
      label: 'Consulting Success Percentage',
      required: true,
      min: 0,
      max: 100,
      defaultValue: 98,
      admin: {
        description: 'The percentage number shown in "Consulting Success" counter',
      }
    },
    {
      name: 'worldwideClients',
      type: 'number',
      label: 'Worldwide Clients Count',
      required: true,
      min: 0,
      defaultValue: 120,
      admin: {
        description: 'The number shown in "Worldwide Clients" counter',
      }
    }
  ],
  access: {
    read: () => true, // Publicly readable
    create: () => true, // Adjust permissions as needed
    update: () => true,
  },
  versions: {
    drafts: true,
  },
};

export default Clients;