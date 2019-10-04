import bottle from 'services/bottle';

export const inject = className => {
  if (className in bottle.container) {
    return bottle.container[className];
  } else {
    throw new Error(`Cannot inject service "${className}"`);
  }
};

export const capitalize = str => {
  return str ? `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}` : '';
}