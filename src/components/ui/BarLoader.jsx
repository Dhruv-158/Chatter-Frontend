import React from 'react';
import './BarLoader.css';

/**
 * Animated bar loader with sliding effect
 * @param {string} className - Optional additional CSS classes
 * @param {string} color - Color of the loading bar (default: currentColor)
 * @param {string} backgroundColor - Background color (default: #ddd)
 */
const BarLoader = ({ className = '', color, backgroundColor }) => {
  const style = {};
  if (color) {
    style['--bar-color'] = color;
  }
  if (backgroundColor) {
    style['--bar-bg-color'] = backgroundColor;
  }

  return <div className={`bar-loader ${className}`} style={style}></div>;
};

export default BarLoader;
