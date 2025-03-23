import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

function ImagePreview({ images, onRemove }) {
  const { theme } = useTheme();
  const [hoverIndex, setHoverIndex] = useState(null);
  
  if (images.length === 0) {
    return (
      <div className={`text-center p-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        <p>No images uploaded yet</p>
      </div>
    );
  }

  return (
    <div>
      {images.length > 0 && (
        <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Drag to reorder images. Click the × to remove an image.
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`relative group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 transform ${
              hoverIndex === index ? 'scale-105' : ''
            } ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <div className={`absolute top-0 left-0 text-xs px-2 py-1 rounded-br-lg z-10 ${
              theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-900 text-white'
            } opacity-70`}>
              {index + 1}
            </div>
            <img
              src={image.url}
              alt={image.name}
              className="h-40 w-full object-contain bg-gray-100 dark:bg-gray-900"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200"></div>
            <button
              onClick={() => onRemove(image.id)}
              className={`absolute top-2 right-2 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                theme === 'dark' ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'
              }`}
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className={`p-2 text-xs truncate ${
              theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'
            }`}>
              {image.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImagePreview;