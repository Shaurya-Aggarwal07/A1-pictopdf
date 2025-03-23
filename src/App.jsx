import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImagePreview from './components/ImagePreview';
import ConversionOptions from './components/ConversionOptions';
import CompressionOptions from './components/CompressionOptions';
import ShootingStars from './components/ShootingStars'; 
import Features from './components/Features';
import Footer from './components/Footer';
import HowItWorks from './components/HowItWorks';
import { useTheme } from './context/ThemeContext';
import imageCompression from 'browser-image-compression';
import { PDFDocument } from 'pdf-lib';

function App() {
  const { theme } = useTheme();
  const [images, setImages] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfOptions, setPdfOptions] = useState({
    orientation: 'portrait',
    format: 'a4',
    fileName: 'converted-images.pdf'
  });
  const [compressionOptions, setCompressionOptions] = useState({
    quality: 75,
    compressImages: true,
    optimizePdf: true
  });
  const [pdfSizeEstimate, setPdfSizeEstimate] = useState({
    original: 0,
    compressed: 0
  });
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'preview', 'options'
  
  // Calculate estimated file sizes whenever images or compression options change
  useEffect(() => {
    if (images.length === 0) {
      setPdfSizeEstimate({ original: 0, compressed: 0 });
      return;
    }
    
    // Calculate original size (rough estimate)
    const originalSize = images.reduce((size, img) => size + (img.file.size || 0), 0);
    
    // Estimate compressed size based on quality
    const compressionFactor = compressionOptions.compressImages 
      ? Math.max(0.1, compressionOptions.quality / 100) 
      : 1;
    
    const optimizationFactor = compressionOptions.optimizePdf ? 0.9 : 1;
    
    const compressedSize = originalSize * compressionFactor * optimizationFactor;
    
    setPdfSizeEstimate({
      original: originalSize / (1024 * 1024), // Convert to MB
      compressed: compressedSize / (1024 * 1024) // Convert to MB
    });
  }, [images, compressionOptions]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    setImages(prev => [...prev, ...newImages]);
    if (newImages.length > 0) {
      setActiveTab('preview');
    }
  };

  const removeImage = (id) => {
    setImages(images.filter(image => image.id !== id));
  };

  const reorderImages = (startIndex, endIndex) => {
    const result = Array.from(images);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setImages(result);
  };

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setPdfOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompressionOptionChange = (e) => {
    const { name, value } = e.target;
    setCompressionOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const compressImage = async (imageFile) => {
    if (!compressionOptions.compressImages) return imageFile;
    
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: compressionOptions.quality / 100
    };
    
    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log(`Compression reduced size from ${imageFile.size} to ${compressedFile.size} bytes`);
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      return imageFile; // Return original on error
    }
  };

  const convertToPdf = async () => {
    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    setIsConverting(true);
    
    try {
      // Create a new PDF with jsPDF
      const pdf = new jsPDF({
        orientation: pdfOptions.orientation,
        unit: 'mm',
        format: pdfOptions.format
      });
      
      // Process each image
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        
        // Compress the image if enabled
        let processedImage = image;
        if (compressionOptions.compressImages) {
          const compressedFile = await compressImage(image.file);
          processedImage = {
            ...image,
            file: compressedFile,
            url: URL.createObjectURL(compressedFile)
          };
        }
        
        // Create a temporary image element
        const img = new Image();
        img.src = processedImage.url;
        
        await new Promise(resolve => {
          img.onload = resolve;
        });
        
        // Calculate dimensions for proper scaling
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        let imgWidth = img.width;
        let imgHeight = img.height;
        
        // Scale the image to fit within the page
        if (imgWidth > pageWidth || imgHeight > pageHeight) {
          const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
          imgWidth *= ratio;
          imgHeight *= ratio;
        }
        
        // Center the image on the page
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;
        
        // Add a new page for each image after the first one
        if (i > 0) {
          pdf.addPage();
        }
        
        // Add the image to PDF - use JPEG format with custom quality setting
        const imageFormat = 'JPEG';
        const imageQuality = compressionOptions.compressImages ? compressionOptions.quality / 100 : 0.8;
        
        pdf.addImage(processedImage.url, imageFormat, x, y, imgWidth, imgHeight, undefined, 'FAST', imageQuality);
      }
      
      // Get the PDF as a Uint8Array for potential further optimization
      const pdfOutput = pdf.output('arraybuffer');
      
      // Optimize the PDF if enabled
      if (compressionOptions.optimizePdf) {
        try {
          // Load the PDF using pdf-lib
          const pdfDoc = await PDFDocument.load(pdfOutput);
          
          // Apply optimization options
          const optimizedPdfBytes = await pdfDoc.save({
            useObjectStreams: true,
            addCompression: true
          });
          
          // Create a Blob from the optimized PDF
          const blob = new Blob([optimizedPdfBytes], { type: 'application/pdf' });
          saveAs(blob, pdfOptions.fileName.endsWith('.pdf') ? pdfOptions.fileName : `${pdfOptions.fileName}.pdf`);
        } catch (optimizeError) {
          console.error('Error optimizing PDF, falling back to standard output:', optimizeError);
          pdf.save(pdfOptions.fileName);
        }
      } else {
        // Save the PDF directly
        pdf.save(pdfOptions.fileName);
      }
    } catch (error) {
      console.error('Error converting images to PDF:', error);
      alert('An error occurred while converting images to PDF. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-darkBg text-gray-200' : 'bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800'}`}>
      <ShootingStars /> {/* Add the ShootingStars component here */}
      <Header className={'z-10'} />
      
      <div className="container mx-auto py-8 px-4 z-10">
        {/* Hero section */}
        <div className="text-center mb-10 animate-slideUp">
          <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Transform Your Images into Professional PDFs
          </h2>
          <p className={`text-lg max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Upload multiple images and convert them into a single, high-quality PDF document in seconds.
            No registration required, and your files never leave your computer.
          </p>
        </div>

        {/* Main conversion section */}
        <div className={`rounded-xl shadow-lg p-6 mb-10 border transition-colors duration-300 relative z-10 ${
          theme === 'dark' 
            ? 'bg-darkCard border-darkBorder' 
            : 'bg-white border-gray-200'
        } animate-fadeIn`}>
          {/* Tabs */}
          {images.length > 0 && (
            <div className="flex mb-6 border-b border-opacity-20">
              <button 
                className={`px-4 py-3 font-medium transition-colors duration-200 ${
                  activeTab === 'upload' 
                    ? theme === 'dark' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600' 
                    : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('upload')}
              >
                Upload Images
              </button>
              <button 
                className={`px-4 py-3 font-medium transition-colors duration-200 ${
                  activeTab === 'preview' 
                    ? theme === 'dark' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600' 
                    : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('preview')}
              >
                Preview ({images.length})
              </button>
              <button 
                className={`px-4 py-3 font-medium transition-colors duration-200 ${
                  activeTab === 'options' 
                    ? theme === 'dark' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600' 
                    : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('options')}
              >
                PDF Settings
              </button>
            </div>
          )}
          
          {/* Tab content */}
          <div className="mb-6">
            {activeTab === 'upload' && <ImageUploader onUpload={handleImageUpload} isConverting={isConverting} />}
            
            {activeTab === 'preview' && (
              <div className="animate-fadeIn">
                <ImagePreview 
                  images={images} 
                  onRemove={removeImage} 
                  onReorder={reorderImages} 
                />
              </div>
            )}
            
            {activeTab === 'options' && (
              <div className="animate-fadeIn">
                <ConversionOptions 
                  options={pdfOptions} 
                  onChange={handleOptionChange} 
                />
                <CompressionOptions
                  compressionOptions={compressionOptions}
                  onChange={handleCompressionOptionChange}
                />
                
                {/* Size estimation display */}
                {images.length > 0 && pdfSizeEstimate.original > 0 && (
                  <div className={`mt-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h4 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                      Estimated File Size
                    </h4>
                    
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Original: {pdfSizeEstimate.original.toFixed(2)} MB
                      </span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Compressed: {pdfSizeEstimate.compressed.toFixed(2)} MB
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.max(100 - Math.round((pdfSizeEstimate.compressed / pdfSizeEstimate.original) * 100), 5)}%` }}>
                      </div>
                    </div>
                    
                    <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Estimated size reduction: 
                      <span className="font-semibold ml-1">
                        {Math.round((1 - pdfSizeEstimate.compressed / pdfSizeEstimate.original) * 100)}%
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {images.length > 0 ? (
                <span>{images.length} image{images.length !== 1 ? 's' : ''} ready for conversion</span>
              ) : (
                <span>Upload images to get started</span>
              )}
            </div>
            
            <div className="flex gap-3">
              {images.length > 0 && (
                <button
                  onClick={() => {
                    setImages([]);
                    setActiveTab('upload');
                  }}
                  className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
                    theme === 'dark' 
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Clear All
                </button>
              )}
              <button
                onClick={convertToPdf}
                disabled={isConverting || images.length === 0}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${
                  images.length === 0 ? 'opacity-50' : ''
                }`}
              >
                {isConverting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {compressionOptions.compressImages || compressionOptions.optimizePdf ? 
                    'Compressing & Converting...' : 
                    'Converting...'}
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {compressionOptions.compressImages || compressionOptions.optimizePdf ? 
                    'Compress & Convert' : 
                    'Convert to PDF'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Features section */}
        <Features />
        
        {/* How it works section */}
        <HowItWorks />
      </div>
      
      <Footer />
    </div>
  );
}

export default App;