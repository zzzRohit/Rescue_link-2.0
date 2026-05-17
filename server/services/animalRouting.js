const authorityAnimals = new Set([
  'elephant',
  'tiger',
  'leopard',
  'bear',
  'crocodile',
  'bison'
]);

export const classifyAnimal = (animalType = '') => {
  const normalized = String(animalType).trim().toLowerCase();
  return authorityAnimals.has(normalized) ? 'authority' : 'local';
};

export const getRoutingMessage = (routingType) => (
  routingType === 'authority'
    ? 'This animal requires specialized rescue handling. Local rescuers were not notified for direct rescue.'
    : 'Nearby local rescuers were notified.'
);
