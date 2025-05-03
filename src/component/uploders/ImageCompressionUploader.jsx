import React, { useState, useRef, useCallback } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios'
const ImageCompressionUploader = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [compressionType, setCompressionType] = useState('medium');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // State for the compressed image
  const [compressedImageUrl, setCompressedImageUrl] = useState(null);
  const [compressedImageName, setCompressedImageName] = useState('');
  
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
      
      // Reset status messages and compressed image
      setUploadStatus('');
      setErrorMessage('');
      setCompressedImageUrl(null);
      
      // Set the compressed image name
      const fileName = file.name;
      const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
      const fileExt = fileName.substring(fileName.lastIndexOf('.'));
      setCompressedImageName(`${fileNameWithoutExt}-compressed${fileExt}`);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const handleCompressionChange = (event) => {
    setCompressionType(event.target.value);
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
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        processFile(file);
      } else {
        setErrorMessage('Please drop an image file');
      }
    }
  }, []);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select an image to upload');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');
    setUploadStatus('Uploading...');

    // Create form data to send
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('compressionType', compressionType);

    try {

      const response = await axios.post(`${apiUrl}/image-operation/compress-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'arraybuffer',
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 0,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadStatus(`Uploading: ${percentCompleted}%`);
        }
      });
      
      const blob = new Blob([response.data], { type: selectedFile.type });
      const compressedUrl = URL.createObjectURL(blob);
      setCompressedImageUrl(compressedUrl);
          
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage(`Upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedImageUrl) return;
    
    const link = document.createElement('a');
    link.href = compressedImageUrl;
    link.download = compressedImageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-900 text-white flex justify-center pt-20">
      <div className="max-w-md mx-auto my-8 p-6 bg-gray-800 text-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-400">Image Upload & Compression</h1>
        
        {/* Drag and Drop Area */}
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
            accept="image/*"
          />
          
          <Upload className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
          
          <p className="text-white mb-2">
            Drag & drop your image here
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
        
        <div className="mb-4">
          <label className="block text-white mb-2">Select Compression Level:</label>
          <select
            className="w-full p-2 border border-gray-600 bg-gray-700 rounded-md text-white"
            value={compressionType}
            onChange={handleCompressionChange}
          >
            <option value="low">Low Compression (Higher Quality)</option>
            <option value="medium">Medium Compression (Balanced)</option>
            <option value="high">High Compression (Smaller Size)</option>
          </select>
        </div>
        
        {previewUrl && (
          <div className="mb-4">
            <p className="text-white mb-2">Original Preview:</p>
            <div className="border border-gray-600 rounded-md overflow-hidden">
              <img 
                src={previewUrl} 
                alt="Original Preview" 
                className="w-full object-contain max-h-48" 
              />
            </div>
          </div>
        )}
        
        <button
          onClick={handleUpload}
          disabled={isUploading || !selectedFile}
          className={`w-full p-2 rounded-md font-medium ${
            isUploading || !selectedFile 
              ? 'bg-indigo-700 cursor-not-allowed opacity-70' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white`}
        >
          {isUploading ? 'Processing...' : 'Upload & Compress Image'}
        </button>
        
        {uploadStatus && (
          <p className="mt-3 text-green-400 text-center">{uploadStatus}</p>
        )}
        
        {errorMessage && (
          <p className="mt-3 text-red-400 text-center">{errorMessage}</p>
        )}
        
        {/* Compressed Image Display Section */}
        {compressedImageUrl && (
          <div className="mt-8 border-t border-gray-600 pt-4">
            <p className="text-white mb-2">Compressed Result:</p>
            <div className="border border-gray-600 rounded-md overflow-hidden mb-4">
              <img 
                src={compressedImageUrl} 
                alt="Compressed Preview" 
                className="w-full object-contain max-h-48" 
              />
            </div>
            
            <button
              onClick={handleDownload}
              className="w-full p-2 rounded-md font-medium bg-green-600 text-white hover:bg-green-700"
            >
              Download Compressed Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCompressionUploader;