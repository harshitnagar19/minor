import React, { useState } from 'react';
import axios from 'axios';

const ImageCompressionUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [compressionType, setCompressionType] = useState('medium');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // State for the compressed image
  const [compressedImageUrl, setCompressedImageUrl] = useState(null);
  const [compressedImageName, setCompressedImageName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
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

  const handleCompressionChange = (event) => {
    setCompressionType(event.target.value);
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
      // Configure axios for the upload
      const response = await axios.post('http://localhost:9999/image-operation/compress-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'arraybuffer', // To receive binary data correctly
        // These settings help with large file uploads
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 0, // No timeout
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadStatus(`Uploading: ${percentCompleted}%`);
        }
      });
      
      // Convert the compressed buffer to a blob URL
      const blob = new Blob([response.data], { 
        type: selectedFile.type // Use the same MIME type
      });
      const compressedUrl = URL.createObjectURL(blob);
      setCompressedImageUrl(compressedUrl);
      
      setUploadStatus('Image compressed successfully!');
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
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Image Upload & Compression</h1>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Compression Level:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          value={compressionType}
          onChange={handleCompressionChange}
        >
          <option value="low">Low Compression (Higher Quality)</option>
          <option value="medium">Medium Compression (Balanced)</option>
          <option value="high">High Compression (Smaller Size)</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Choose Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
        />
      </div>
      
      {previewUrl && (
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Original Preview:</p>
          <div className="border border-gray-300 rounded-md overflow-hidden">
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
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isUploading ? 'Processing...' : 'Upload & Compress Image'}
      </button>
      
      {uploadStatus && (
        <p className="mt-3 text-green-600 text-center">{uploadStatus}</p>
      )}
      
      {errorMessage && (
        <p className="mt-3 text-red-600 text-center">{errorMessage}</p>
      )}
      
      {/* Compressed Image Display Section */}
      {compressedImageUrl && (
        <div className="mt-8 border-t pt-4">
          <p className="text-gray-700 mb-2">Compressed Result:</p>
          <div className="border border-gray-300 rounded-md overflow-hidden mb-4">
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
  );
};

export default ImageCompressionUploader;