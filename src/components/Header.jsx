import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

function Header() {
  const { theme } = useTheme();
  
  return (
    <header className={`bg-gradient-to-r ${theme === 'dark' ? 'from-blue-900 to-indigo-900' : 'from-blue-600 to-blue-800'} shadow-md transition-colors duration-300`}>
      <div className="container mx-auto py-4 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white mr-3 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Pic to PDF
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#features" className="text-blue-100 hover:text-white transition-colors duration-200">
              Features
            </a>
            <a href="#how-it-works" className="text-blue-100 hover:text-white transition-colors duration-200">
              How It Works
            </a>
            <a href="https://github.com/Shaurya-Aggarwal07/images-to-pdf-converter" 
              className={`${theme === 'dark' ? 'bg-gray-800 text-blue-300 hover:bg-gray-700' : 'bg-white text-blue-600 hover:bg-blue-50'} px-4 py-2 rounded-lg font-medium transition-colors duration-200`}>
              GitHub
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;