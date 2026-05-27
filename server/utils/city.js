export const normalizeCity = (city = '') => {
  const cityNorm = String(city).toLowerCase().trim();
  const cityAliases = {
    bengaluru: 'bangalore',
    bengalore: 'bangalore',
    'bengaluru urban': 'bangalore',
    'bangalore urban': 'bangalore',
    bombay: 'mumbai',
    'new delhi': 'delhi',
    madras: 'chennai',
    mysuru: 'mysore',
    mangaluru: 'mangalore',
    shivamogga: 'shimoga',
    hubballi: 'hubli',
    dharwad: 'hubli',
    'hubli dharwad': 'hubli',
    'hubli-dharwad': 'hubli',
    'hubballi dharwad': 'hubli',
    'hubballi-dharwad': 'hubli',
    belgaum: 'belagavi',
    ballari: 'bellary'
  };
  return cityAliases[cityNorm] || cityNorm;
};

export const serviceAreaCities = (city = '') => {
  const normalized = normalizeCity(city);
  if (normalized === 'hubli') {
    return ['hubli', 'hubballi', 'dharwad', 'hubli dharwad', 'hubli-dharwad', 'hubballi dharwad', 'hubballi-dharwad'];
  }
  if (normalized === 'belagavi') {
    return ['belagavi', 'belgaum'];
  }
  if (normalized === 'bangalore') {
    return ['bangalore', 'bengaluru', 'bengaluru urban', 'bangalore urban'];
  }
  return normalized ? [normalized] : [];
};
