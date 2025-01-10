const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const DEFAULT_LENGTH = 32;

function generateRandomString(length = DEFAULT_LENGTH) {
  const charactersLength = CHARACTERS.length;
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  return Array.from(randomValues, (value) => CHARACTERS[value % charactersLength]).join('');
}

export {generateRandomString};