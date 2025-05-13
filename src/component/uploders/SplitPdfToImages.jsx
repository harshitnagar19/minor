import React, { useState, useRef, useCallback } from 'react';
import { FileImage, Upload } from 'lucide-react';

const SplitPdfToImages = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrorMessage('Please upload a valid PDF file.');
        return;
      }
      
      setSelectedFile(file);
      setUploadStatus('');
      setErrorMessage('');
      setConversionProgress(0);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleSplit = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a PDF to split.');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');
    setUploadStatus('Splitting PDF...');

    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      const progressInterval = setInterval(() => {
        setConversionProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch(`${apiUrl}/pdf-operation/split-pdf`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setConversionProgress(100);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      const pdfName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'));
      link.href = url;
      link.setAttribute('download', `${pdfName}_images.zip`);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setUploadStatus('Splitting successful!');
    } catch (error) {
      console.error('Error splitting PDF:', error);
      setErrorMessage(`Splitting failed: ${error.message || 'Unknown error'}`);
      setConversionProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white flex justify-center pt-20">
      <div className="max-w-md mx-auto my-8 p-6 bg-gray-800 text-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-400">Split PDF into Images</h1>

        <div
          className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-900/20' 
              : 'border-gray-600 hover:border-indigo-400 hover:bg-gray-700/30'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="application/pdf"
          />
          
          <FileImage className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
          
          <p className="text-white mb-2">
            Drag & drop your PDF here
          </p>
          <p className="text-gray-400 text-sm">
            or <span className="text-indigo-400">click to browse</span> your files
          </p>

          {selectedFile && (
            <p className="mt-4 text-green-400 text-sm">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        <button
          onClick={handleSplit}
          disabled={isUploading || !selectedFile}
          className={`w-full p-2 rounded-md font-medium ${
            isUploading || !selectedFile
              ? 'bg-indigo-700 cursor-not-allowed opacity-70'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white`}
        >
          {isUploading ? 'Splitting...' : 'Split PDF'}
        </button>

        {/* Progress bar */}
        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${conversionProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 text-center mt-1">
              {conversionProgress}% Complete
            </p>
          </div>
        )}

        {uploadStatus && !isUploading && (
          <p className="mt-3 text-green-400 text-center">{uploadStatus}</p>
        )}

        {errorMessage && (
          <p className="mt-3 text-red-400 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default SplitPdfToImages;
