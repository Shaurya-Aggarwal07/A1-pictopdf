import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

function HowItWorks() {
  const { theme } = useTheme();
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    {
      number: "01",
      title: "Upload Images",
      description: "Select multiple images by clicking the upload button or drag and drop files into the upload area."
    },
    {
      number: "02",
      title: "Arrange Order",
      description: "Preview your images and rearrange them to set the order they'll appear in the PDF."
    },
    {
      number: "03",
      title: "Choose Settings",
      description: "Select your preferred page orientation, size, and set a custom filename for your PDF."
    },
    {
      number: "04",
      title: "Convert & Download",
      description: "Click 'Convert to PDF' and your document will be generated and downloaded automatically."
    },
  ];

  return (
    <div className="mb-16 scroll-mt-16" id="how-it-works">
      <h2 className={`text-2xl md:text-3xl font-bold text-center mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="relative"
            onMouseEnter={() => setActiveStep(index)}
            onMouseLeave={() => setActiveStep(null)}
          >
            <div className={`rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mb-4 transition-all duration-300 transform ${
              activeStep === index ? 'scale-110' : ''
            } ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-blue-700 to-blue-900 text-white' 
                : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
            }`}>
              {step.number}
            </div>
            {index < steps.length - 1 && (
              <div className={`hidden lg:block absolute top-6 left-12 w-full h-0.5 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-200'}`}></div>
            )}
            <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''} transition-colors duration-200 ${activeStep === index ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600' : ''}`}>
              {step.title}
            </h3>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;