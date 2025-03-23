import { useTheme } from '../context/ThemeContext';

function ConversionOptions({ options, onChange }) {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>PDF Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="orientation" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Page Orientation
          </label>
          <div className="flex space-x-4">
            <label className={`flex-1 flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
              options.orientation === 'portrait' 
                ? theme === 'dark' ? 'border-blue-500 bg-blue-900 bg-opacity-30' : 'border-blue-500 bg-blue-50'
                : theme === 'dark' ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input 
                type="radio"
                name="orientation"
                value="portrait"
                checked={options.orientation === 'portrait'}
                onChange={onChange}
                className="sr-only"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className={`text-sm ${
                options.orientation === 'portrait' 
                  ? theme === 'dark' ? 'font-medium text-blue-400' : 'font-medium text-blue-700'
                  : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Portrait</span>
            </label>
            <label className={`flex-1 flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
              options.orientation === 'landscape' 
                ? theme === 'dark' ? 'border-blue-500 bg-blue-900 bg-opacity-30' : 'border-blue-500 bg-blue-50'
                : theme === 'dark' ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input 
                type="radio"
                name="orientation"
                value="landscape"
                checked={options.orientation === 'landscape'}
                onChange={onChange}
                className="sr-only"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
              </svg>
              <span className={`text-sm ${
                options.orientation === 'landscape' 
                  ? theme === 'dark' ? 'font-medium text-blue-400' : 'font-medium text-blue-700'
                  : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Landscape</span>
            </label>
          </div>
        </div>
        
        <div>
          <label htmlFor="format" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Page Size
          </label>
          <select
            id="format"
            name="format"
            value={options.format}
            onChange={onChange}
            className={`block w-full pl-3 pr-10 py-2 text-base border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'border-gray-300 text-gray-700'
            }`}
          >
            <option value="a4">A4 (210 × 297 mm)</option>
            <option value="letter">US Letter (8.5 × 11 in)</option>
            <option value="legal">US Legal (8.5 × 14 in)</option>
            <option value="a3">A3 (297 × 420 mm)</option>
            <option value="a5">A5 (148 × 210 mm)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="fileName" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            File Name
          </label>
          <input
            type="text"
            id="fileName"
            name="fileName"
            value={options.fileName}
            onChange={onChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'border-gray-300 text-gray-700'
            }`}
            placeholder="converted-images.pdf"
          />
          <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {!options.fileName.endsWith('.pdf') && options.fileName.trim() !== '' ? "File extension '.pdf' will be added automatically" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConversionOptions;