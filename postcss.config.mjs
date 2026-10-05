import globalData from '@csstools/postcss-global-data';
import customMedia from 'postcss-custom-media';

// Named breakpoints (@media (--tablet) …) in every stylesheet and component
// <style> block. See src/styles/breakpoints.css.
export default {
  plugins: [
    globalData({ files: ['src/styles/breakpoints.css'] }),
    customMedia(),
  ],
};
