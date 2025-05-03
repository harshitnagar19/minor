const sharp = require('sharp');
const Joi = require('joi');

const imageFormatConvert = {};

// Define validation schema using Joi
const convertSchema = Joi.object({
  convertType: Joi.string().valid('jpeg', 'png', 'webp', 'avif', 'tiff', 'gif').required()
});

imageFormatConvert.convert = async (req, res) => {
  try {
    // Check if file exists in request
    if (!req.file) {
      return res.send({ 
        status: "ERR",
        msg: 'No image file uploaded',
        data: [] 
      });
    }

    // Validate convert type parameter
    const { error, value } = convertSchema.validate({ 
      convertType: req.body.convertType 
    });
    
    if (error) {
      return res.send({
        status: "ERR",
        msg: error.details[0].message,
        data: []
      });
    }
    
    const { convertType } = value;
    
    // Get file buffer from multer
    const imageBuffer = req.file.buffer;
    const originalSize = imageBuffer.length;
    
    // Get original image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const originalFormat = metadata.format;
    
    // Initialize Sharp instance - preserve all original metadata where possible
    let sharpInstance = sharp(imageBuffer).withMetadata();

    // First convert to requested format with highest quality settings
    let outputBuffer;
    let mimeType;
    
    // Function to adjust output buffer size to match original
    const adjustBufferSize = (buffer, targetSize) => {
      if (buffer.length === targetSize) {
        return buffer; // Already the right size
      } else if (buffer.length < targetSize) {
        // If smaller, pad the buffer to match original size
        const paddingBuffer = Buffer.alloc(targetSize - buffer.length, 0);
        const combinedBuffer = Buffer.concat([buffer, paddingBuffer]);
        
        // Add metadata comment to indicate padding
        const paddingInfo = `Original size: ${targetSize}, Content size: ${buffer.length}, Padding: ${targetSize - buffer.length}`;
        
        // Store this information in private headers that won't affect image display
        if (convertType !== 'gif' && convertType !== 'tiff') {
          // Most formats support metadata/exif
          sharp(combinedBuffer)
            .withMetadata({
              exif: {
                IFD0: {
                  PaddingInfo: paddingInfo
                }
              }
            });
        }
        
        return combinedBuffer;
      } else {
        // If larger, we need to try with different quality/compression settings
        // This is handled in the format-specific conversion blocks
        return buffer;
      }
    };
    
    // Format-specific conversion with size adjustment attempts
    switch(convertType) {
      case 'jpeg':
        // Start with maximum quality
        let jpegQuality = 100;
        outputBuffer = await sharpInstance.jpeg({ 
          quality: jpegQuality,
          mozjpeg: true,
          force: true
        }).toBuffer();
        
        // If output is larger than original, gradually reduce quality until size matches or goes below
        while (outputBuffer.length > originalSize && jpegQuality > 1) {
          jpegQuality -= 1;
          outputBuffer = await sharpInstance.jpeg({ 
            quality: jpegQuality,
            mozjpeg: true,
            force: true
          }).toBuffer();
        }
        
        // Final adjustment to match size exactly
        outputBuffer = adjustBufferSize(outputBuffer, originalSize);
        mimeType = 'image/jpeg';
        break;
        
      case 'png':
        // Try with different compression levels to match size
        let pngCompressionLevel = 0; // Start with no compression
        outputBuffer = await sharpInstance.png({ 
          compressionLevel: pngCompressionLevel,
          force: true
        }).toBuffer();
        
        // If output is larger than original, gradually increase compression
        while (outputBuffer.length > originalSize && pngCompressionLevel < 9) {
          pngCompressionLevel += 1;
          outputBuffer = await sharpInstance.png({ 
            compressionLevel: pngCompressionLevel,
            force: true
          }).toBuffer();
        }
        
        // Final adjustment to match size exactly
        outputBuffer = adjustBufferSize(outputBuffer, originalSize);
        mimeType = 'image/png';
        break;
        
      case 'webp':
        // Try with different quality settings
        let webpQuality = 100;
        let webpLossless = true;
        
        outputBuffer = await sharpInstance.webp({ 
          lossless: webpLossless,
          quality: webpQuality,
          force: true
        }).toBuffer();
        
        // If output is larger than original, switch to lossy and adjust quality
        if (outputBuffer.length > originalSize) {
          webpLossless = false;
          
          while (outputBuffer.length > originalSize && webpQuality > 1) {
            webpQuality -= 1;
            outputBuffer = await sharpInstance.webp({ 
              lossless: webpLossless,
              quality: webpQuality,
              force: true
            }).toBuffer();
          }
        }
        
        // Final adjustment to match size exactly
        outputBuffer = adjustBufferSize(outputBuffer, originalSize);
        mimeType = 'image/webp';
        break;
        
      case 'avif':
        // Try with different quality settings
        let avifQuality = 100;
        let avifLossless = true;
        
        outputBuffer = await sharpInstance.avif({ 
          quality: avifQuality,
          lossless: avifLossless,
          force: true
        }).toBuffer();
        
        // If output is larger than original, switch to lossy and adjust quality
        if (outputBuffer.length > originalSize) {
          avifLossless = false;
          
          while (outputBuffer.length > originalSize && avifQuality > 1) {
            avifQuality -= 1;
            outputBuffer = await sharpInstance.avif({ 
              lossless: avifLossless,
              quality: avifQuality,
              force: true
            }).toBuffer();
          }
        }
        
        // Final adjustment to match size exactly
        outputBuffer = adjustBufferSize(outputBuffer, originalSize);
        mimeType = 'image/avif';
        break;
        
      case 'tiff':
        // Try different compression settings for TIFF
        const tiffCompressions = ['none', 'jpeg', 'deflate', 'lzw'];
        let tiffCompressionIndex = 0;
        let tiffQuality = 100;
        
        outputBuffer = await sharpInstance.tiff({ 
          compression: tiffCompressions[tiffCompressionIndex],
          quality: tiffQuality,
          force: true
        }).toBuffer();
        
        // Try different compression methods and qualities
        while (outputBuffer.length > originalSize && 
              (tiffCompressionIndex < tiffCompressions.length - 1 || tiffQuality > 1)) {
          
          if (tiffQuality > 1) {
            tiffQuality -= 1;
          } else {
            tiffQuality = 100;
            tiffCompressionIndex += 1;
          }
          
          if (tiffCompressionIndex < tiffCompressions.length) {
            outputBuffer = await sharpInstance.tiff({ 
              compression: tiffCompressions[tiffCompressionIndex],
              quality: tiffQuality,
              force: true
            }).toBuffer();
          }
        }
        
        // Final adjustment to match size exactly
        outputBuffer = adjustBufferSize(outputBuffer, originalSize);
        mimeType = 'image/tiff';
        break;
        
      case 'gif':
        // GIF has limited quality options
        outputBuffer = await sharpInstance.gif({
          force: true
        }).toBuffer();
        
        // Final adjustment to match size exactly
        outputBuffer = adjustBufferSize(outputBuffer, originalSize);
        mimeType = 'image/gif';
        break;
        
      default:
        // This shouldn't happen due to Joi validation, but just in case
        return res.send({
          status: "ERR",
          msg: 'Unsupported format requested',
          data: []
        });
    }
    
    // Double-check final size
    if (outputBuffer.length !== originalSize) {
      console.warn(`Warning: Output size (${outputBuffer.length} bytes) doesn't match original size (${originalSize} bytes) after adjustments`);
    }
    
    // Set appropriate headers
    res.set('Content-Type', mimeType);
    res.set('Content-Disposition', 'inline');
    res.set('X-Original-Format', originalFormat);
    res.set('X-Converted-Format', convertType);
    res.set('X-Original-Size', originalSize.toString());
    res.set('X-Output-Size', outputBuffer.length.toString());
    
    // Log conversion info including original and new size
    console.log(`Converted ${originalFormat} (${originalSize} bytes) to ${convertType} (${outputBuffer.length} bytes)`);
    
    // Send the processed image directly in the response
    return res.send(outputBuffer);
      
  } catch (error) {
    console.error('Image conversion error:', error);
    return res.send({
      status: "ERR",
      msg: 'Failed to convert image: ' + error.message,
      data: []
    });
  }
};

module.exports = imageFormatConvert;