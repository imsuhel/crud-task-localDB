import {Platform} from 'react-native';

let cached = '';
export function deviceId() {
  if (cached) return cached;
  const rnd = Math.random().toString(36).slice(2);
  cached = `${Platform.OS}-${rnd}`;
  return cached;
}

export function generateId() {
  const cryptoObj = global.crypto || {};
  if (typeof cryptoObj.randomUUID === 'function') {
    return cryptoObj.randomUUID();
  }
  const getRandomValues = cryptoObj.getRandomValues?.bind(cryptoObj);
  const bytes = getRandomValues ? getRandomValues(new Uint8Array(16)) : null;
  const rnd = a => (bytes ? bytes[a] : Math.floor(Math.random() * 256));
  const b = new Uint8Array(16);
  for (let i = 0; i < 16; i++) b[i] = rnd(i);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const hex = [...b].map(n => n.toString(16).padStart(2, '0'));
  return (
    hex[0] +
    hex[1] +
    hex[2] +
    hex[3] +
    '-' +
    hex[4] +
    hex[5] +
    '-' +
    hex[6] +
    hex[7] +
    '-' +
    hex[8] +
    hex[9] +
    '-' +
    hex[10] +
    hex[11] +
    hex[12] +
    hex[13] +
    hex[14] +
    hex[15]
  );
}
