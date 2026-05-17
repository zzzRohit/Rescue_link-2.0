const nationalContacts = [
  {
    name: 'Authorized Wildlife Rescue Helpline',
    phone: '1926',
    type: 'government',
    coverage: 'India'
  },
  {
    name: 'Emergency Response',
    phone: '112',
    type: 'government',
    coverage: 'India'
  }
];

const cityContacts = {
  bangalore: [
    {
      name: 'BBMP Specialized Animal Rescue',
      phone: '080-22975595',
      type: 'government',
      coverage: 'Bengaluru'
    },
    {
      name: 'People For Animals Wildlife Hospital',
      phone: '+91 99000 25370',
      type: 'ngo',
      coverage: 'Bengaluru'
    }
  ],
  mysore: [
    {
      name: 'Mysuru Authorized Rescue Control Room',
      phone: '0821-2480901',
      type: 'government',
      coverage: 'Mysuru'
    }
  ]
};

export const getWildlifeContacts = (city = '') => {
  const normalizedCity = String(city).trim().toLowerCase();
  return [...(cityContacts[normalizedCity] || []), ...nationalContacts];
};
