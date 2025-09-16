import {Platform} from 'react-native';

let cached = '';
export function deviceId() {
  if (cached) return cached;
  const rnd = Math.random().toString(36).slice(2);
  cached = `${Platform.OS}-${rnd}`;
  return cached;
}
