// src/components/CompressionOptions.jsx
import { useTheme } from '../context/ThemeContext';

function CompressionOptions({ compressionOptions, onChange }) {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-lg p-6 mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>
        Compression Settings
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="quality" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Image Quality: {compressionOptions.quality}%
          </label>
          <input
            type="range"
            id="quality"
            name="quality"
            min="10"
            max="100"
            step="5"
            value={compressionOptions.quality}
            onChange={onChange}
            className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${theme === 'dark' ? 'bg-gray-700' : ''}`}
          />
          <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Lower quality = smaller file size
          </p>
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Compression Options
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="compress-images"
                name="compressImages"
                checked={compressionOptions.compressImages}
                onChange={(e) => onChange({
                  target: {
                    name: e.target.name,
                    value: e.target.checked
                  }
                })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="compress-images" className={`ml-2 block text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Compress images before adding to PDF
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="optimize-pdf"
                name="optimizePdf"
                checked={compressionOptions.optimizePdf}
                onChange={(e) => onChange({
                  target: {
                    name: e.target.name,
                    value: e.target.checked
                  }
                })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="optimize-pdf" className={`ml-2 block text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Optimize final PDF structure
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100 text-sm text-blue-800 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-300">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Compression may affect image quality. Preview available after conversion.</span>
        </div>
      </div>
    </div>
  );
}

export default CompressionOptions;