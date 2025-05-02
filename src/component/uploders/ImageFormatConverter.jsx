import React, { useState, useRef, useCallback } from 'react';
import { Upload, Image, X, Trash2, Download, Settings } from 'lucide-react';

const ImageFormatConverter = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isConverting, setIsConverting] = useState(false);
    const [conversionStatus, setConversionStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [targetFormat, setTargetFormat] = useState('png');
    const [quality, setQuality] = useState(80);
    const [showSettings, setShowSettings] = useState(false);
    const [convertedImages, setConvertedImages] = useState([]);

    const fileInputRef = useRef(null);
    
    const supportedFormats = [
        { value: 'png', label: 'PNG' },
        { value: 'jpeg', label: 'JPEG' },
        { value: 'webp', label: 'WebP' },
        { value: 'gif', label: 'GIF' },
        { value: 'bmp', label: 'BMP' }
    ];

    const processFiles = (files) => {
        if (files && files.length > 0) {
            const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

            if (newFiles.length === 0) {
                setErrorMessage('Please select image files only');
                return;
            }

            // Create preview URLs
            const filesWithPreview = newFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file),
                id: `${file.name}-${Date.now()}`
            }));

            setSelectedFiles(prev => [...prev, ...filesWithPreview]);
            setErrorMessage('');
            setConvertedImages([]);
        }
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        processFiles(files);
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
        processFiles(files);
    }, []);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleRemoveFile = (id) => {
        setSelectedFiles(prev => {
            const updatedFiles = prev.filter(file => file.id !== id);
            if (updatedFiles.length === 0) {
                setConvertedImages([]);
            }
            return updatedFiles;
        });
    };

    const handleConvert = async () => {
        if (selectedFiles.length === 0) {
            setErrorMessage('Please add at least one image');
            return;
        }

        setIsConverting(true);
        setErrorMessage('');
        setConversionStatus(`Converting images to ${targetFormat.toUpperCase()}...`);

        try {
            // Simulate conversion delay for demo purposes
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // In a real implementation, you would process the images for conversion
            // For demo, create converted image objects with placeholders
            const converted = selectedFiles.map((file, index) => ({
                id: `converted-${index}-${Date.now()}`,
                originalName: file.file.name,
                // Create a filename with the new extension
                convertedName: file.file.name.replace(/\.[^.]+$/, `.${targetFormat}`),
                preview: `/api/placeholder/300/300`, // Using a placeholder image
                url: `/api/placeholder/300/300`, // This would be the download URL in a real implementation
            }));
            
            setConvertedImages(converted);
            setConversionStatus('Conversion completed successfully!');
        } catch (error) {
            console.error('Error converting images:', error);
            setErrorMessage(`Conversion failed: ${error.message || 'Unknown error'}`);
        } finally {
            setIsConverting(false);
        }
    };

    const handleClearAll = () => {
        // Revoke all object URLs to prevent memory leaks
        selectedFiles.forEach(file => URL.revokeObjectURL(file.preview));
        setSelectedFiles([]);
        setConvertedImages([]);
        setConversionStatus('');
        setErrorMessage('');
    };

    const handleDownload = (image) => {
        if (!image.url) return;
        
        // In a real implementation, this would download the actual converted image
        // For demo purposes, we'll simulate downloading by opening in a new tab
        window.open(image.url, '_blank');
    };

    const handleDownloadAll = () => {
        // In a real implementation, this would download all converted images as a zip
        // For demo, we'll just log a message
        console.log('Downloading all converted images');
        // A real implementation might create a zip file of all converted images
        window.open(convertedImages[0].url, '_blank');
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    return (
        <div className="bg-gray-900 text-white flex justify-center pt-20">
            <div className="max-w-md w-full mx-auto my-8 p-6 bg-gray-800 text-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-indigo-400">Image Format Converter</h1>

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
                        multiple
                    />

                    <Upload className="w-12 h-12 mx-auto mb-4 text-indigo-400" />

                    <p className="text-white mb-2">
                        Drag & drop your images here
                    </p>
                    <p className="text-gray-400 text-sm">
                        or <span className="text-indigo-400">click to browse</span> your files
                    </p>
                    <p className="mt-2 text-gray-400 text-xs">
                        Supports JPG, PNG, WebP, GIF, BMP
                    </p>
                </div>

                {/* Conversion Settings */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-white">Target Format:</label>
                        <button
                            onClick={toggleSettings}
                            className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                        >
                            <Settings className="w-4 h-4 mr-1" />
                            {showSettings ? 'Hide Settings' : 'Advanced Settings'}
                        </button>
                    </div>
                    
                    <select
                        value={targetFormat}
                        onChange={(e) => setTargetFormat(e.target.value)}
                        className="w-full p-2 border border-gray-600 bg-gray-700 rounded-md text-white mb-4"
                    >
                        {supportedFormats.map(format => (
                            <option key={format.value} value={format.value}>
                                {format.label}
                            </option>
                        ))}
                    </select>

                    {showSettings && (
                        <div className="p-4 border border-gray-700 rounded-md bg-gray-700/30 mb-4">
                            <label className="block text-white mb-2">Quality ({quality}%):</label>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={quality}
                                onChange={(e) => setQuality(parseInt(e.target.value))}
                                className="w-full"
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                Higher quality means larger file size. Only applies to lossy formats like JPEG and WebP.
                            </p>
                        </div>
                    )}
                </div>

                {/* Selected Images List */}
                {selectedFiles.length > 0 && (
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-white">Selected Images ({selectedFiles.length}):</p>
                            <button
                                onClick={handleClearAll}
                                className="text-red-400 hover:text-red-300 text-sm flex items-center"
                            >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Clear All
                            </button>
                        </div>

                        <div className="max-h-64 overflow-y-auto border border-gray-700 rounded-md">
                            {selectedFiles.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center p-2 hover:bg-gray-700 border-b border-gray-700 last:border-b-0"
                                >
                                    <div className="w-12 h-12 flex-shrink-0 mr-3 bg-gray-900 rounded overflow-hidden">
                                        <img src={file.preview} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow overflow-hidden">
                                        <p className="text-sm text-white truncate">{file.file.name}</p>
                                        <p className="text-xs text-gray-400">
                                            {(file.file.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFile(file.id)}
                                        className="text-gray-400 hover:text-red-400 ml-2"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={handleConvert}
                    disabled={isConverting || selectedFiles.length === 0}
                    className={`w-full p-3 rounded-md font-medium flex items-center justify-center ${
                        isConverting || selectedFiles.length === 0
                            ? 'bg-indigo-700 cursor-not-allowed opacity-70'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white mb-3`}
                >
                    <Image className="w-5 h-5 mr-2" />
                    {isConverting ? 'Converting...' : `Convert to ${targetFormat.toUpperCase()}`}
                </button>

                {conversionStatus && (
                    <p className="mt-2 text-green-400 text-center">{conversionStatus}</p>
                )}

                {errorMessage && (
                    <p className="mt-2 text-red-400 text-center">{errorMessage}</p>
                )}

                {/* Converted Images Section */}
                {convertedImages.length > 0 && (
                    <div className="mt-6 border-t border-gray-600 pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-white">Converted Images:</p>
                            {convertedImages.length > 1 && (
                                <button
                                    onClick={handleDownloadAll}
                                    className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                                >
                                    <Download className="w-4 h-4 mr-1" />
                                    Download All
                                </button>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {convertedImages.map((image) => (
                                <div key={image.id} className="border border-gray-700 rounded-md overflow-hidden bg-gray-700/40 p-2">
                                    <div className="mb-2 aspect-square bg-gray-900 rounded overflow-hidden">
                                        <img src={image.preview} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-xs text-white truncate mb-1">{image.convertedName}</p>
                                    <button
                                        onClick={() => handleDownload(image)}
                                        className="w-full p-2 rounded text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center"
                                    >
                                        <Download className="w-3 h-3 mr-1" />
                                        Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageFormatConverter;