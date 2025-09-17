import {Dimensions, PixelRatio} from 'react-native';

// Get screen dimensions
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// Base dimensions for scaling (design guideline)
// Adjust these to your design reference device (e.g., iPhone X: 375x812)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Scale size horizontally (based on screen width)
 * @param {number} size - size in design pixels
 */
export const scale = size => (SCREEN_WIDTH / BASE_WIDTH) * size;

/**
 * Scale size vertically (based on screen height)
 * @param {number} size - size in design pixels
 */
export const verticalScale = size => (SCREEN_HEIGHT / BASE_HEIGHT) * size;

/**
 * Moderate scale: scales but with a factor (to avoid extreme scaling on very large/small screens)
 * @param {number} size - size in design pixels
 * @param {number} factor - adjustment factor (default = 0.5)
 */
export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

/**
 * Normalize font sizes across devices
 * Uses PixelRatio to ensure fonts look consistent on iOS & Android
 * @param {number} size - font size in design pixels
 */
export const fontScale = size => {
  const scaledSize = scale(size);
  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};
