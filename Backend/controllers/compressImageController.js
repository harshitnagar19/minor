
const sharp = require('sharp');
const Joi = require('joi');


const compressImageController = {}

// JOI Validation Schema
const imageSchema = Joi.object({
    compressionType: Joi.string().valid('low', 'medium', 'high').required(),
  });
  
  // Compression quality map
  const qualityMap = {
    low: 30,
    medium: 50,
    high: 70,
  };

  
compressImageController.compress = async (req,res)=>{
    try {
        const { error } = imageSchema.validate(req.body);
        if (error) return res.send({ 
            status:"ERR",
            msg:error.details[0].message,
            data: [] });
        console.log("running")
    
        const compressionType = req.body.compressionType;
        console.log(compressionType)
        const quality = qualityMap[compressionType];
        console.log("req",req)
        const image = req.file;
        if (!image) return res.status(400).json({ error: 'Image is required' });
    
        // Compress image in memory
        const compressedBuffer = await sharp(image.buffer)
          .jpeg({ quality }) // You can switch to .png() or .webp() if needed
          .toBuffer();
    
        // Send compressed image buffer back
        res.set('Content-Type', 'image/jpeg');
    res.send(compressedBuffer); 

      } catch (err) {
        console.error(err.message);
        res.send({ 
            status:"ERR",
            msg:"Error in image compression",
            data:[]});
    }
}

module.exports = compressImageController;