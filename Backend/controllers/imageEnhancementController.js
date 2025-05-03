const sharp = require('sharp');
const Joi = require('joi');

const imageEnhancementController = {};

// Define validation schema using Joi
const enhancementSchema = Joi.object({
  quality: Joi.number().min(10).max(25).required() // Target file size in MB
});

imageEnhancementController.enhancement = async (req, res) => {
  try {
    // Check if file exists in request
    if (!req.file) {
      return res.send({ 
        status:"ERR",
        msg: 'No image file uploaded',
        data:[] });
    }

    // Validate quality parameter (now representing target file size in MB)
    const { error, value } = enhancementSchema.validate({ 
      quality: parseFloat(req.body.quality) 
    });
    
    if (error) {
      return res.send({
        status:"ERR",
        msg: error.details[0].message,
        data:[] });
    }
    
    // Target file size in bytes (convert from MB)
    const targetSizeMB = value.quality;
    const targetSizeBytes = targetSizeMB * 1024 * 1024;
    
    // Get file buffer from multer
    const imageBuffer = req.file.buffer;
    const originalSizeBytes = imageBuffer.length;
    const originalSizeMB = originalSizeBytes / (1024 * 1024);
    
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    
    // Initialize quality level and processed buffer
    let outputQuality = 90; // Start with high quality
    let processedImageBuffer;
    let currentSizeBytes;
    let attempts = 0;
    const maxAttempts = 10;
    
    // If original image is already larger than target size, enhance quality without increasing size
    if (originalSizeBytes >= targetSizeBytes) {
      // Enhance quality without increasing dimensions
      processedImageBuffer = await sharp(imageBuffer)
        .sharpen() // Apply sharpening
        .modulate({ brightness: 1.05 }) // Slightly increase brightness
        .jpeg({ quality: outputQuality })
        .toBuffer();
    } else {
      // Calculate how much we can increase dimensions while targeting the file size
      // Start with reasonable enhancement (e.g., 50% larger)
      let scaleFactor = 1.5;
      
      // Initial processing
      processedImageBuffer = await sharp(imageBuffer)
        .resize(Math.round(metadata.width * scaleFactor), Math.round(metadata.height * scaleFactor), {
          kernel: sharp.kernel.lanczos3,
          fit: 'fill'
        })
        .sharpen()
        .modulate({ brightness: 1.05 })
        .jpeg({ quality: outputQuality })
        .toBuffer();
      
      currentSizeBytes = processedImageBuffer.length;
      
      // Iteratively adjust dimensions or quality to approach target size
      while (Math.abs(currentSizeBytes - targetSizeBytes) / targetSizeBytes > 0.1 && attempts < maxAttempts) {
        attempts++;
        
        if (currentSizeBytes > targetSizeBytes) {
          // Too large, reduce quality or scale
          if (outputQuality > 30) {
            outputQuality -= 5;
          } else {
            scaleFactor *= 0.9;
          }
        } else {
          // Too small, increase quality or scale
          if (outputQuality < 95) {
            outputQuality += 5;
          } else {
            scaleFactor *= 1.1;
          }
        }
        
        // Recalculate with new parameters
        processedImageBuffer = await sharp(imageBuffer)
          .resize(Math.round(metadata.width * scaleFactor), Math.round(metadata.height * scaleFactor), {
            kernel: sharp.kernel.lanczos3,
            fit: 'fill'
          })
          .sharpen()
          .modulate({ brightness: 1.05 })
          .jpeg({ quality: outputQuality })
          .toBuffer();
          
        currentSizeBytes = processedImageBuffer.length;
      }
    }
    
    // Final size after processing
    const finalSizeBytes = processedImageBuffer.length;
    const finalSizeMB = finalSizeBytes / (1024 * 1024);
    
    // Set appropriate headers
    res.set('Content-Type', 'image/jpeg');
    res.set('Content-Disposition', 'inline');
    
    // Include size info in headers for frontend reference
    res.set('X-Original-Size-MB', originalSizeMB.toFixed(2));
    res.set('X-Final-Size-MB', finalSizeMB.toFixed(2));
    
    // Send the processed image directly in the response
    return res.send(processedImageBuffer);
      
  } catch (error) {
    console.error('Image enhancement error:', error);
    return res.send({
        status:"ERR",
        msg:'Failed to enhance image',
        data:[] });
  }
};

module.exports = imageEnhancementController;