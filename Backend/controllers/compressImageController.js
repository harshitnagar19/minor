
const sharp = require('sharp');
const Joi = require('joi');


const compressImageController = {}

const imageSchema = Joi.object({
    compressionType: Joi.string().valid('low', 'medium', 'high').required(),
  });
  
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
    
        const compressionType = req.body.compressionType;
        const quality = qualityMap[compressionType];

        const image = req.file;
        if (!image) return res.send(
          { status: 'ERR',
            msg:"Image is required",
            data:[]
          });
    
        const compressedBuffer = await sharp(image.buffer).jpeg({ quality }).toBuffer();
    
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