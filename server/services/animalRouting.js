const authorityAnimals = new Set([
  "elephant",
  "tiger",
  "leopard",
  "cheetah",
  "lion",
  "rhino",
  "rhinoceros",
  "bear",
  "crocodile",
  "bison",
  "hippopotamus",
  "hyena",
  "wild boar",
  "python",
  "cobra",
  "anaconda",
  "boa",
  "alligator",
  "deer",
  "wild cat",
  "puma",
  "jaguar",
  "panther",
]);

export const classifyAnimal = (animalType = "") => {
  const normalized = String(animalType).trim().toLowerCase();
  return authorityAnimals.has(normalized) ? "authority" : "local";
};

export const getRoutingMessage = (routingType) =>
  routingType === "authority"
    ? "This animal requires specialized rescue handling. Local rescuers were not notified for direct rescue."
    : "Nearby local rescuers were notified.";
