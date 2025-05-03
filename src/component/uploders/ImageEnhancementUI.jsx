import React, { useState, useRef, useCallback } from 'react';
import { Upload, Wand2 } from 'lucide-react';
import axios from 'axios';

const ImageEnhancementUI = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    // State for the enhanced image
    const [enhancedImageUrl, setEnhancedImageUrl] = useState(null);
    const [enhancedImageName, setEnhancedImageName] = useState('');

    // Quality value (MB size target)
    const [quality, setQuality] = useState(15);

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

            // Reset status messages and enhanced image
            setProcessingStatus('');
            setErrorMessage('');
            setEnhancedImageUrl(null);

            // Set the enhanced image name
            const fileName = file.name;
            const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
            const fileExt = fileName.substring(fileName.lastIndexOf('.'));
            setEnhancedImageName(`${fileNameWithoutExt}-enhanced${fileExt}`);
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

    const handleEnhance = async () => {
        if (!selectedFile) {
            setErrorMessage('Please select an image to enhance');
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');
        setProcessingStatus('Enhancing your image...');

        try {
            // Create form data
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('quality', quality.toString());

            // Call the backend API
            const response = await axios({
                method: 'post',
                url: `${apiUrl}/image-operation/enhance-image`,
                data: formData,
                responseType: 'arraybuffer', // Important for binary data
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Check if the response is an error message (JSON)
            const contentType = response.headers['content-type'];
            if (contentType && contentType.includes('application/json')) {
                // If it's JSON, it's probably an error
                const errorData = JSON.parse(new TextDecoder().decode(response.data));
                if (errorData.status === 'ERR') {
                    throw new Error(errorData.msg || 'Enhancement failed');
                }
            }

            // Get original and enhanced size from headers
            const originalSize = response.headers['x-original-size-mb'];
            const enhancedSize = response.headers['x-final-size-mb'];
            
            if (originalSize && enhancedSize) {
                setProcessingStatus(`Image enhanced successfully! Size: ${originalSize}MB → ${enhancedSize}MB`);
            } else {
                setProcessingStatus('Image enhanced successfully!');
            }

            // Convert the binary response to a blob URL
            const blob = new Blob([response.data], { type: 'image/jpeg' });
            const enhancedUrl = URL.createObjectURL(blob);
            setEnhancedImageUrl(enhancedUrl);
            
        } catch (error) {
            console.error('Error enhancing image:', error);
            setErrorMessage(`Enhancement failed: ${error.message || 'Unknown error'}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!enhancedImageUrl) return;

        const link = document.createElement('a');
        link.href = enhancedImageUrl;
        link.download = enhancedImageName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-gray-900 text-white flex justify-center pt-20">
            <div className="max-w-md mx-auto my-8 p-6 bg-gray-800 text-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-indigo-400">Image Enhancement</h1>

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
                    <label className="block text-white mb-2">Target File Size (MB):</label>
                    <input
                        type="range"
                        min="10"
                        max="25"
                        step="1"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                        <span>10 MB</span>
                        <span>{quality} MB</span>
                        <span>25 MB</span>
                    </div>
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
                    onClick={handleEnhance}
                    disabled={isProcessing || !selectedFile}
                    className={`w-full p-2 rounded-md font-medium flex items-center justify-center ${isProcessing || !selectedFile
                            ? 'bg-indigo-700 cursor-not-allowed opacity-70'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white`}
                >
                    <Wand2 className="w-5 h-5 mr-2" />
                    {isProcessing ? 'Processing...' : 'Enhance Image'}
                </button>

                {processingStatus && (
                    <p className="mt-3 text-green-400 text-center">{processingStatus}</p>
                )}

                {errorMessage && (
                    <p className="mt-3 text-red-400 text-center">{errorMessage}</p>
                )}

                {/* Enhanced Image Display Section */}
                {enhancedImageUrl && (
                    <div className="mt-8 border-t border-gray-600 pt-4">
                        <p className="text-white mb-2">Enhanced Result:</p>
                        <div className="border border-gray-600 rounded-md overflow-hidden mb-4">
                            <img
                                src={enhancedImageUrl}
                                alt="Enhanced Preview"
                                className="w-full object-contain max-h-48"
                            />
                        </div>

                        <button
                            onClick={handleDownload}
                            className="w-full p-2 rounded-md font-medium bg-green-600 text-white hover:bg-green-700"
                        >
                            Download Enhanced Image
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageEnhancementUI;