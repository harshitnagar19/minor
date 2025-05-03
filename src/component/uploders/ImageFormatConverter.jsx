import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileType } from 'lucide-react';
import axios from 'axios';

const ImageFormatConverter = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    // State for the converted image
    const [convertedImageUrl, setConvertedImageUrl] = useState(null);
    const [convertedImageName, setConvertedImageName] = useState('');

    // Format conversion type
    const [convertType, setConvertType] = useState('jpeg');

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

            // Reset status messages and converted image
            setProcessingStatus('');
            setErrorMessage('');
            setConvertedImageUrl(null);

            // Set the converted image name based on the selected format
            const fileName = file.name;
            const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
            setConvertedImageName(`${fileNameWithoutExt}.${convertType}`);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
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

    const handleFormatChange = (e) => {
        const newFormat = e.target.value;
        setConvertType(newFormat);
        
        // Update the file name if a file is selected
        if (selectedFile) {
            const fileName = selectedFile.name;
            const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
            setConvertedImageName(`${fileNameWithoutExt}.${newFormat}`);
        }
    };

    const handleConvert = async () => {
        if (!selectedFile) {
            setErrorMessage('Please select an image to convert');
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');
        setProcessingStatus(`Converting image to ${convertType.toUpperCase()}...`);

        try {
            // Create form data
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('convertType', convertType);

            // Call the backend API
            const response = await axios.post(`${apiUrl}/image-operation/format-change`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                },
                responseType: 'arraybuffer' // Important for binary (image) data
              });

            // Check if the response is an error message (JSON)
            const contentType = response.headers['content-type'];
            if (contentType && contentType.includes('application/json')) {
                // If it's JSON, it's probably an error
                const errorData = JSON.parse(new TextDecoder().decode(response.data));
                if (errorData.status === 'ERR') {
                    throw new Error(errorData.msg || 'Conversion failed');
                }
            }

            // Get original and converted format from headers
            const originalFormat = response.headers['x-original-format'];
            const convertedFormat = response.headers['x-converted-format'];
            
            if (originalFormat && convertedFormat) {
                setProcessingStatus(`Image converted successfully! ${originalFormat.toUpperCase()} → ${convertedFormat.toUpperCase()}`);
            } else {
                setProcessingStatus('Image converted successfully!');
            }

            // Convert the binary response to a blob URL with appropriate mime type
            let mimeType;
            switch(convertType) {
                case 'jpeg': mimeType = 'image/jpeg'; break;
                case 'png': mimeType = 'image/png'; break;
                case 'webp': mimeType = 'image/webp'; break;
                case 'avif': mimeType = 'image/avif'; break;
                case 'tiff': mimeType = 'image/tiff'; break;
                case 'gif': mimeType = 'image/gif'; break;
                default: mimeType = 'image/jpeg';
            }
            
            const blob = new Blob([response.data], { type: mimeType });
            const convertedUrl = URL.createObjectURL(blob);
            setConvertedImageUrl(convertedUrl);
            
        } catch (error) {
            console.error('Error converting image:', error);
            setErrorMessage(`Conversion failed: ${error.message || 'Unknown error'}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!convertedImageUrl) return;

        const link = document.createElement('a');
        link.href = convertedImageUrl;
        link.download = convertedImageName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-gray-900 text-white flex justify-center pt-20">
            <div className="max-w-md mx-auto my-8 p-6 bg-gray-800 text-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-indigo-400">Image Format Conversion</h1>

                {/* Drag and Drop Area */}
                <div
                    className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center cursor-pointer transition-all duration-200 ${isDragging
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
                    <label className="block text-white mb-2">Convert to Format:</label>
                    <select
                        className="w-full p-2 border border-gray-600 bg-gray-700 rounded-md text-white"
                        value={convertType}
                        onChange={handleFormatChange}
                    >
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                        <option value="avif">AVIF</option>
                        <option value="tiff">TIFF</option>
                        <option value="gif">GIF</option>
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
                    onClick={handleConvert}
                    disabled={isProcessing || !selectedFile}
                    className={`w-full p-2 rounded-md font-medium flex items-center justify-center ${isProcessing || !selectedFile
                            ? 'bg-indigo-700 cursor-not-allowed opacity-70'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white`}
                >
                    <FileType className="w-5 h-5 mr-2" />
                    {isProcessing ? 'Processing...' : `Convert to ${convertType.toUpperCase()}`}
                </button>

                {processingStatus && (
                    <p className="mt-3 text-green-400 text-center">{processingStatus}</p>
                )}

                {errorMessage && (
                    <p className="mt-3 text-red-400 text-center">{errorMessage}</p>
                )}

                {/* Converted Image Display Section */}
                {convertedImageUrl && (
                    <div className="mt-8 border-t border-gray-600 pt-4">
                        <p className="text-white mb-2">Converted Result:</p>
                        <div className="border border-gray-600 rounded-md overflow-hidden mb-4">
                            <img
                                src={convertedImageUrl}
                                alt="Converted Preview"
                                className="w-full object-contain max-h-48"
                            />
                        </div>

                        <button
                            onClick={handleDownload}
                            className="w-full p-2 rounded-md font-medium bg-green-600 text-white hover:bg-green-700"
                        >
                            Download {convertType.toUpperCase()} Image
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageFormatConverter;