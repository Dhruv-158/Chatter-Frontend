import React from 'react';
import DotLoader from './DotLoader';
import BarLoader from './BarLoader';

/**
 * Example component demonstrating how to use the loaders
 */
const LoaderExamples = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Dot Loader</h2>
        <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
          <DotLoader />
          <span>Loading...</span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Bar Loader</h2>
        
        {/* Default */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Default</p>
          <BarLoader />
        </div>

        {/* Custom colors */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Custom colors (blue)</p>
          <BarLoader color="#3b82f6" backgroundColor="#dbeafe" />
        </div>

        {/* Custom colors - green */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Custom colors (green)</p>
          <BarLoader color="#10b981" backgroundColor="#d1fae5" />
        </div>

        {/* Custom colors - purple */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Custom colors (purple)</p>
          <BarLoader color="#8b5cf6" backgroundColor="#ede9fe" />
        </div>
      </div>
    </div>
  );
};

export default LoaderExamples;
