const fs = require('fs');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const pdfParse = require('pdf-parse');
const { Document, Packer, Paragraph } = require('docx');

// Controller for PDF to Word conversion
const pdfToWordController = {};

pdfToWordController.convert = async (req, res) => {
  // Create temporary directory for this conversion
  const tempDirName = uuidv4();
  const tempDir = path.join(os.tmpdir(), tempDirName);
  const wordPath = path.join(tempDir, 'document.docx');
  
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        msg: "No document provided",
        data: []
      });
    }
    
    // Create temp directory
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Parse text from PDF buffer
    const pdfData = await pdfParse(req.file.buffer);
    const textContent = pdfData.text.trim();

    if (!textContent) {
      return res.status(400).json({
        status: "error",
        msg: "No text content found in PDF",
        data: []
      });
    }

    // Create a DOCX document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: textContent.split('\n').map(line => new Paragraph(line))
        }
      ]
    });

    // Generate Word buffer
    const wordBuffer = await Packer.toBuffer(doc);

    // Write to temp file
    fs.writeFileSync(wordPath, wordBuffer);

    // Set response headers for Word file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="converted-document.docx"`);

    // Send the Word buffer
    res.send(wordBuffer);

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({
      status: "error",
      msg: `Error converting file: ${error.message}`,
      data: []
    });
  } finally {
    // Clean up temporary files
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (cleanupError) {
      console.error('Error cleaning up:', cleanupError);
    }
  }
};

module.exports = pdfToWordController;
