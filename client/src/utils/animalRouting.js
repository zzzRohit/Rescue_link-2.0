const authorityAnimals = new Set([
  'elephant',
  'tiger',
  'leopard',
  'bear',
  'crocodile',
  'bison'
]);

export const getAnimalRoutingType = (animalType = '') => (
  authorityAnimals.has(String(animalType).trim().toLowerCase()) ? 'authority' : 'local'
);

export const getAnimalRoutingCopy = (animalType = '') => {
  if (!animalType) return null;
  return getAnimalRoutingType(animalType) === 'authority'
    ? {
      title: 'Specialized rescue required',
      text: 'Do not approach or attempt rescue. This case needs authorized rescue support, so specialized contacts will be shown instead of notifying local rescuers.',
      tone: 'amber'
    }
    : {
      title: 'Local animal rescue response',
      text: 'Nearby verified animal rescuers can be notified after you submit this report.',
      tone: 'green'
    };
};
