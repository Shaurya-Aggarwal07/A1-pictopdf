import { useTheme } from '../context/ThemeContext';

function Features() {
  const { theme } = useTheme();

  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "100% Secure",
      description: "Your images never leave your device. All processing happens locally in your browser."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: "High Quality",
      description: "Maintains image quality and preserves original aspect ratios in the resulting PDF."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Customizable",
      description: "Choose page orientation, size, and set a custom filename for your PDF."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lightning Fast",
      description: "Convert multiple images to PDF in seconds, no waiting for uploads or downloads."
    },
  ];

  return (
    <div className="mb-16 scroll-mt-16" id="features">
      <h2 className={`text-2xl md:text-3xl font-bold text-center mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        Why Choose Our Converter?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-1 ${
              theme === 'dark' 
                ? 'bg-darkCard border-darkBorder' 
                : 'bg-white border-gray-100'
            }`}
            data-aos="fade-up" 
            data-aos-delay={index * 100}
          >
            <div className={`p-3 rounded-full mb-4 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'}`}>
              {feature.icon}
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>{feature.title}</h3>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;