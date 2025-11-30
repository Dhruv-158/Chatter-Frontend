import React from 'react';
import './DotLoader.css';

/**
 * Animated three-dot loader
 * @param {string} className - Optional additional CSS classes
 */
const DotLoader = ({ className = '' }) => {
  return <div className={`dot-loader ${className}`}></div>;
};

export default DotLoader;
