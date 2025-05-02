import React, { useState, useRef, useCallback } from 'react';
import { Upload, Wand2 } from 'lucide-react';

const ImageEnhancementUI = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    // State for the enhanced image
    const [enhancedImageUrl, setEnhancedImageUrl] = useState(null);
    const [enhancedImageName, setEnhancedImageName] = useState('');

    // Enhancement type
    const [enhancementType, setEnhancementType] = useState('auto');

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
            // Simulate processing delay for demo purposes
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real implementation, you would send the image and enhancement type to your backend
            // For demo, we'll just use the original image as the "enhanced" result
            setEnhancedImageUrl(previewUrl);
            setProcessingStatus('Image enhanced successfully!');
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
                    <label className="block text-white mb-2">Select Enhancement Type:</label>
                    <select
                        className="w-full p-2 border border-gray-600 bg-gray-700 rounded-md text-white"
                        value={enhancementType}
                        onChange={(e) => setEnhancementType(e.target.value)}
                    >
                        <option value="auto">Auto Enhance</option>
                        <option value="color">Color Correction</option>
                        <option value="lighting">Lighting Improvement</option>
                        <option value="hdr">HDR Effect</option>
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