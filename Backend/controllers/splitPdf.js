const puppeteer = require('puppeteer');
const pdfParse = require('pdf-parse');
const AdmZip = require('adm-zip');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const os = require('os');

const splitPdf = {};

splitPdf.split = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfBuffer = req.file.buffer;

    if (!pdfBuffer || pdfBuffer.length < 5 || pdfBuffer.toString('ascii', 0, 5) !== '%PDF-') {
      return res.status(400).json({ error: 'Invalid PDF file' });
    }

    const tempDir = path.join(os.tmpdir(), uuidv4());
    fs.mkdirSync(tempDir, { recursive: true });

    const zip = new AdmZip();

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Save PDF temporarily
    const tempPdfPath = path.join(tempDir, 'temp.pdf');
    fs.writeFileSync(tempPdfPath, pdfBuffer);

    await page.goto(`file://${tempPdfPath}`, { waitUntil: 'networkidle0' });

    // Use pdf-parse to get number of pages
    const pdfData = await pdfParse(pdfBuffer);
    const numPages = pdfData.numpages;

    console.log(`PDF has ${numPages} pages`);

    for (let i = 1; i <= numPages; i++) {
      // Go to specific page
      await page.goto(`file://${tempPdfPath}#page=${i}`, { waitUntil: 'networkidle0' });

      const imgBuffer = await page.screenshot({ type: 'jpeg', quality: 100, fullPage: true });
      const imgPath = path.join(tempDir, `page_${i}.jpg`);

      fs.writeFileSync(imgPath, imgBuffer);
      zip.addLocalFile(imgPath);
    }

    await browser.close();

    const zipBuffer = zip.toBuffer();
    fs.rmSync(tempDir, { recursive: true, force: true });

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="pdf_pages.zip"',
      'Content-Length': zipBuffer.length
    });

    res.send(zipBuffer);

  } catch (error) {
    console.error('Error splitting PDF into images:', error);
    res.status(500).json({
      error: 'Failed to process PDF file',
      message: error.message
    });
  }
};

module.exports = splitPdf;
