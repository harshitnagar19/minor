import React, { useState, useRef, useCallback } from 'react';
import { Upload, FilePlus, File, X, Trash2, Plus, ChevronUp, ChevronDown, Move, Settings } from 'lucide-react';
import axios from 'axios';

const ImageToPdfConverter = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isConverting, setIsConverting] = useState(false);
    const [conversionStatus, setConversionStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [pdfName, setPdfName] = useState('converted-document.pdf');
    const [pdfUrl, setPdfUrl] = useState(null);
    const [isDragReordering, setIsDragReordering] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);
    
    // Add state for the new options that match your controller's Joi validation
    const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
    const [pageSize, setPageSize] = useState('custom');
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

    const fileInputRef = useRef(null);
    const addMoreFilesRef = useRef(null);

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
                id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            }));

            setSelectedFiles(prev => [...prev, ...filesWithPreview]);
            setErrorMessage('');
            setPdfUrl(null);
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
    }, []);

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

    const handleAddMoreClick = () => {
        addMoreFilesRef.current.click();
    };

    const handleRemoveFile = (id) => {
        setSelectedFiles(prev => {
            const updatedFiles = prev.filter(file => file.id !== id);

            // If all files are removed, reset pdf URL
            if (updatedFiles.length === 0) {
                setPdfUrl(null);
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
        setConversionStatus('Uploading and converting images to PDF...');
    
        try {
            const formData = new FormData();
            
            // Important: Changed to match controller's expected field name (from 'image' to 'images')
            selectedFiles.forEach(file => {
                formData.append('image', file.file);
            });
            
            // Add advanced options to match controller's Joi validation
            formData.append('pageSize', pageSize);
            formData.append('maintainAspectRatio', maintainAspectRatio);
            
            // Include PDF name as filename in response header
            const filename = pdfName.endsWith('.pdf') ? pdfName : `${pdfName}.pdf`;
            
            const response = await axios.post(
                `${apiUrl}/image-operation/image-to-pdf`,  // Adjust this to match your actual endpoint
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    responseType: 'blob', // Important to receive binary data (PDF)
                }
            );
    
            // Check if the response is a PDF or an error message
            const contentType = response.headers['content-type'];
            
            if (contentType === 'application/pdf') {
                // Success - create blob URL from PDF data
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const pdfBlobUrl = URL.createObjectURL(blob);
                setPdfUrl(pdfBlobUrl);
                setConversionStatus('Conversion completed successfully!');
            } else {
                // Handle error response
                // Convert blob to text to read the error message
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const errorData = JSON.parse(reader.result);
                        setErrorMessage(`Conversion failed: ${errorData.message || 'Unknown error'}`);
                    } catch (e) {
                        setErrorMessage('Conversion failed: Server returned an invalid response');
                    }
                };
                reader.readAsText(response.data);
            }
        } catch (error) {
            console.error('Error converting images:', error);
            
            // Better error handling to extract message from response when available
            if (error.response) {
                if (error.response.data instanceof Blob) {
                    // Try to read error message from blob
                    const reader = new FileReader();
                    reader.onload = () => {
                        try {
                            const errorData = JSON.parse(reader.result);
                            setErrorMessage(`Conversion failed: ${errorData.message || 'Unknown error'}`);
                        } catch (e) {
                            setErrorMessage(`Conversion failed: ${error.message || 'Server error'}`);
                        }
                    };
                    reader.readAsText(error.response.data);
                } else {
                    setErrorMessage(`Conversion failed: ${error.response.data?.message || error.message || 'Server error'}`);
                }
            } else {
                setErrorMessage(`Conversion failed: ${error.message || 'Unknown error'}`);
            }
        } finally {
            setIsConverting(false);
        }
    };

    const handleClearAll = () => {
        // Revoke all object URLs to prevent memory leaks
        selectedFiles.forEach(file => URL.revokeObjectURL(file.preview));
        setSelectedFiles([]);
        setPdfUrl(null);
        setConversionStatus('');
        setErrorMessage('');
    };

    const handleDownload = () => {
        if (!pdfUrl) return;

        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = pdfName.endsWith('.pdf') ? pdfName : `${pdfName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const moveFile = (fromIndex, toIndex) => {
        if (fromIndex === toIndex) return;
        
        setSelectedFiles(prevFiles => {
            const newFiles = [...prevFiles];
            const [movedFile] = newFiles.splice(fromIndex, 1);
            newFiles.splice(toIndex, 0, movedFile);
            return newFiles;
        });
    };

    const handleMoveUp = (index) => {
        if (index > 0) {
            moveFile(index, index - 1);
        }
    };

    const handleMoveDown = (index) => {
        if (index < selectedFiles.length - 1) {
            moveFile(index, index + 1);
        }
    };

    const handleDragStart = (index) => {
        setIsDragReordering(true);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setIsDragReordering(false);
        setDraggedIndex(null);
    };

    const handleDragOverItem = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        
        moveFile(draggedIndex, index);
        setDraggedIndex(index);
    };

    const toggleAdvancedOptions = () => {
        setAdvancedOptionsOpen(!advancedOptionsOpen);
    };

    return (
        <div className="bg-gray-900 text-white flex justify-center pt-10">
            <div className="max-w-md w-full mx-auto my-8 p-6 bg-gray-800 text-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-indigo-400">Image to PDF Converter</h1>

                {/* Drag and Drop Area (Initial if no files yet) */}
                {selectedFiles.length === 0 && (
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
                            You can select multiple images at once
                        </p>
                    </div>
                )}

                {/* PDF name input */}
                <div className="mb-4">
                    <label className="block text-white mb-2">PDF Filename:</label>
                    <input
                        type="text"
                        value={pdfName}
                        onChange={(e) => setPdfName(e.target.value)}
                        className="w-full p-2 border border-gray-600 bg-gray-700 rounded-md text-white"
                        placeholder="Enter PDF filename"
                    />
                </div>

                {/* Advanced Options Section - matches your controller's validation */}
                <div className="mb-4">
                    <button
                        onClick={toggleAdvancedOptions}
                        className="flex items-center justify-between w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white hover:bg-gray-600"
                    >
                        <span className="flex items-center">
                            <Settings className="w-5 h-5 mr-2" />
                            Advanced Options
                        </span>
                        <span>{advancedOptionsOpen ? '▲' : '▼'}</span>
                    </button>
                    
                    {advancedOptionsOpen && (
                        <div className="p-3 mt-2 border border-gray-600 rounded-md bg-gray-700">
                            
                            {/* Page Size Selection */}
                            <div className="mb-3">
                                <label className="block text-sm mb-1">Page Size:</label>
                                <select
                                    value={pageSize}
                                    onChange={(e) => setPageSize(e.target.value)}
                                    className="w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white"
                                >
                                    <option value="custom">Custom (Match Image Size)</option>
                                    <option value="A4">A4</option>
                                    <option value="A3">A3</option>
                                    <option value="letter">Letter</option>
                                    <option value="legal">Legal</option>
                                </select>
                            </div>
                            
                            {/* Maintain Aspect Ratio */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="aspectRatio"
                                    checked={maintainAspectRatio}
                                    onChange={() => setMaintainAspectRatio(!maintainAspectRatio)}
                                    className="mr-2 h-4 w-4"
                                />
                                <label htmlFor="aspectRatio" className="text-sm">
                                    Maintain aspect ratio
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Selected Images List with Add More button */}
                {selectedFiles.length > 0 && (
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-white">Selected Images ({selectedFiles.length}):</p>
                            <div className="flex space-x-2">
                                <input
                                    type="file"
                                    ref={addMoreFilesRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                />
                                <button
                                    onClick={handleAddMoreClick}
                                    className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add More
                                </button>
                                <button
                                    onClick={handleClearAll}
                                    className="text-red-400 hover:text-red-300 text-sm flex items-center"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Clear All
                                </button>
                            </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto border border-gray-700 rounded-md">
                            {selectedFiles.map((file, index) => (
                                <div
                                    key={file.id}
                                    draggable={true}
                                    onDragStart={() => handleDragStart(index)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => handleDragOverItem(e, index)}
                                    className={`flex items-center p-2 hover:bg-gray-700 border-b border-gray-700 last:border-b-0 ${
                                        isDragReordering && draggedIndex === index ? 'opacity-50 bg-gray-600' : ''
                                    }`}
                                >
                                    <div className="mr-2 cursor-move text-gray-400">
                                        <Move className="w-4 h-4" />
                                    </div>
                                    <div className="w-12 h-12 flex-shrink-0 mr-3 bg-gray-900 rounded overflow-hidden">
                                        <img src={file.preview} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow overflow-hidden">
                                        <p className="text-sm text-white truncate">{file.file.name}</p>
                                        <p className="text-xs text-gray-400">
                                            {(file.file.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                    <div className="flex items-center ml-2">
                                        <div className="flex flex-col mr-2">
                                            <button
                                                onClick={() => handleMoveUp(index)}
                                                disabled={index === 0}
                                                className={`text-gray-400 ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
                                            >
                                                <ChevronUp className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleMoveDown(index)}
                                                disabled={index === selectedFiles.length - 1}
                                                className={`text-gray-400 ${index === selectedFiles.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
                                            >
                                                <ChevronDown className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFile(file.id)}
                                            className="text-gray-400 hover:text-red-400"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Add more images button (below list) */}
                        <button
                            onClick={handleAddMoreClick}
                            className="w-full mt-3 p-2 border border-dashed border-indigo-500 rounded-md text-indigo-400 hover:bg-indigo-900/20 flex items-center justify-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add More Images
                        </button>
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
                    <FilePlus className="w-5 h-5 mr-2" />
                    {isConverting ? 'Converting...' : 'Convert to PDF'}
                </button>

                {conversionStatus && (
                    <p className="mt-2 text-green-400 text-center">{conversionStatus}</p>
                )}

                {errorMessage && (
                    <p className="mt-2 text-red-400 text-center">{errorMessage}</p>
                )}

                {/* PDF Preview and Download Section */}
                {pdfUrl && (
                    <div className="mt-6 border-t border-gray-600 pt-4">
                        <p className="text-white mb-2">PDF Generated:</p>
                        <div className="border border-gray-600 rounded-md overflow-hidden mb-4 p-4 text-center bg-gray-700">
                            <File className="w-16 h-16 mx-auto mb-2 text-indigo-400" />
                            <p className="text-sm text-white">{pdfName}</p>
                        </div>

                        <button
                            onClick={handleDownload}
                            className="w-full p-3 rounded-md font-medium bg-green-600 text-white hover:bg-green-700"
                        >
                            Download PDF
                        </button>
                        
                        {/* Option to add more images after conversion */}
                        <button
                            onClick={handleAddMoreClick}
                            className="w-full mt-3 p-2 rounded-md border border-indigo-500 text-indigo-400 hover:bg-indigo-900/20 flex items-center justify-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add More Images & Reconvert
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageToPdfConverter;