const PDFDocument = require('pdfkit');
const Joi = require('joi');
const sharp = require('sharp'); // Add sharp for advanced image processing

// Schema for request validation
const requestSchema = Joi.object({
  pageSize: Joi.string().valid('A4', 'A3', 'letter', 'legal', 'custom').default('custom'),
  maintainAspectRatio: Joi.boolean().default(true)
});

// Standard page sizes in points (72 points = 1 inch)
const PAGE_SIZES = {
  'A4': [595.28, 841.89],
  'A3': [841.89, 1190.55],
  'letter': [612, 792],
  'legal': [612, 1008]
};

const imageToPdfConvertController = {};

// Main conversion function
imageToPdfConvertController.convert = async (req, res) => {
  try {
    // Validate request body using Joi
    const { error, value } = requestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    // Extract validated parameters
    const { pageSize, maintainAspectRatio } = value;

    // Validate files exist
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    // Validate all files are images (additional check)
    const invalidFiles = req.files.filter(file => !file.mimetype.startsWith('image/'));
    if (invalidFiles.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some files are not valid images',
        invalidFiles: invalidFiles.map(f => f.originalname)
      });
    }

    // Sort files if needed
    const files = req.files.sort((a, b) => a.originalname.localeCompare(b.originalname));

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=converted-images.pdf');

    // Create PDF document with maximum compression settings
    const doc = new PDFDocument({ 
      autoFirstPage: false, 
      margin: 2, // Remove margins completely
      info: {
        Title: 'Converted Images',
        Author: 'PDF Converter Service',
        CreationDate: new Date()
      },
      compress: true, // Enable built-in compression
      pdfVersion: '1.7', // Use latest PDF version for better compression
      useCSS: true, // Optimize text representation
      bufferPages: true, // Buffer pages for potential optimization
      layout: 'single', // Use single-page layout for smaller file size
      permissions: { // Restrict permissions to reduce metadata
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: true,
        documentAssembly: false
      }
    });

    // Error handling for PDF creation
    doc.on('error', (err) => {
      console.error('PDF generation error:', err);
      // If headers haven't been sent yet
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'Error generating PDF',
          error: err.message
        });
      }
    });

    // Pipe the PDF directly to response
    doc.pipe(res);

    // Track errors with a flag to prevent multiple responses
    let hasError = false;

    // Process each image
    try {
      for (const file of files) {
        try {
          // Preprocess image with sharp for extreme compression
          const preprocessedImageBuffer = await sharp(file.buffer)
            .resize({ 
              width: 800, // Limit max dimension to 800px
              height: 800,
              fit: 'inside',
              withoutEnlargement: true
            })
            .jpeg({ 
              quality: 80, // Very aggressive JPEG compression
              mozjpeg: true // Use mozJPEG for better compression
            })
            .toBuffer();
          
          // Open the preprocessed image to get its dimensions
          const image = doc.openImage(preprocessedImageBuffer);
          let imageWidth = image.width;
          let imageHeight = image.height;
          
          // Determine page size based on parameter
          let pageWidth, pageHeight;
          
          if (pageSize === 'custom') {
            // Use image dimensions for custom page size
            pageWidth = imageWidth;
            pageHeight = imageHeight;
          } else {
            // Use predefined page size
            [pageWidth, pageHeight] = PAGE_SIZES[pageSize];
          }
          
          // Add new page with determined size
          doc.addPage({ 
            size: [pageWidth, pageHeight], 
            margin: 2
          });
          
          // Calculate image dimensions to fit the page while respecting maintainAspectRatio
          let finalWidth, finalHeight;
          
          if (maintainAspectRatio) {
            // Calculate scaling factor to fit within page
            const widthRatio = pageWidth / imageWidth;
            const heightRatio = pageHeight / imageHeight;
            const scaleFactor = Math.min(widthRatio, heightRatio);
            
            finalWidth = imageWidth * scaleFactor;
            finalHeight = imageHeight * scaleFactor;
          } else {
            // Stretch to fill page
            finalWidth = pageWidth;
            finalHeight = pageHeight;
          }
          
          // Calculate centering coordinates
          const x = (pageWidth - finalWidth) / 2;
          const y = (pageHeight - finalHeight) / 2;
          
          // Add preprocessed image to the page with maximum compression
          doc.image(preprocessedImageBuffer, x, y, {
            width: finalWidth,
            height: finalHeight,
            quality: 0.3, // Extremely low quality for maximum compression (0.1 = 10%)
            compressionLevel: 9 // Maximum compression level
          });
          
        } catch (imageError) {
          console.error(`Error processing image ${file.originalname}:`, imageError);
          // Continue with other images rather than failing completely
        }
      }

      // Finalize PDF
      doc.end();
    } catch (pdfError) {
      // Only respond with error if headers haven't been sent
      if (!res.headersSent && !hasError) {
        hasError = true;
        console.error('Error during PDF processing:', pdfError);
        return res.status(500).json({
          success: false,
          message: 'Failed to process images for PDF',
          error: pdfError.message
        });
      }
    }
  } catch (error) {
    // General error handling
    console.error('Error in memory-based PDF conversion:', error);
    // Only send response if headers haven't been sent yet
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to convert images to PDF',
        error: error.message
      });
    }
  }
};

module.exports = imageToPdfConvertController;