import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

function ImageUploader({ onUpload, isConverting }) {
  const { theme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-10 text-center transition-all duration-200 ${
        isDragging 
          ? theme === 'dark' ? 'border-blue-400 bg-blue-900 bg-opacity-20' : 'border-blue-500 bg-blue-50'
          : theme === 'dark' ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-300 bg-gray-50 hover:bg-gray-100' 
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-16 w-16 mb-4 transition-transform duration-500 ${
            isDragging ? 'scale-110 animate-bounce' : 'animate-float'
          } ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>
          {isDragging ? 'Drop Images Here' : 'Drag & Drop Images Here'}
        </h3>
        <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Or click to browse from your device
        </p>
        <input
          type="file"
          id="file-upload"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onUpload}
          disabled={isConverting}
        />
        <label
          htmlFor="file-upload"
          className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white  cursor-pointer transition-all duration-300 ${
            isConverting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          } ${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Select Images
        </label>
        <p className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Supported formats: JPG, JPEG, PNG, GIF, WebP, BMP, TIFF
        </p>
      </div>
    </div>
  );
}

export default ImageUploader;