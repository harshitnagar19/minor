const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const puppeteer = require('puppeteer');

// Controller for Word to PDF conversion
const wordToPdfController = {};

wordToPdfController.convert = async (req, res) => {
  // Create temporary directory for this conversion
  const tempDirName = uuidv4();
  const tempDir = path.join(os.tmpdir(), tempDirName);
  const htmlPath = path.join(tempDir, 'document.html');
  
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
    
    // Enhanced options for mammoth to preserve as much formatting as possible
    const options = {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='heading 1'] => h1:fresh",
        "p[style-name='Title'] => h1.title:fresh",
        "p[style-name='Subtitle'] => h2.subtitle:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
        "p[style-name='heading 4'] => h4:fresh",
        "p[style-name='Heading 5'] => h5:fresh",
        "p[style-name='heading 5'] => h5:fresh",
        "p[style-name='Heading 6'] => h6:fresh",
        "p[style-name='heading 6'] => h6:fresh",
        "p[style-name='Normal'] => p:fresh",
        "p => p:fresh",
        "r[style-name='Strong'] => strong",
        "r[style-name='Emphasis'] => em",
        "r[style-name='Bold'] => strong",
        "r[style-name='Italic'] => em",
        "r[style-name='Underline'] => u",
        "table => table.doc-table",
        "tr => tr",
        "td => td",
        "r[style-name='Hyperlink'] => a"
      ],
      includeDefaultStyleMap: true,
      preserveStyles: true
    };
    
    // Convert to HTML
    const result = await mammoth.convertToHtml({
      buffer: req.file.buffer
    }, options);
    
    let htmlContent = result.value;
    let warnings = result.messages;
    
    if (warnings.length > 0) {
      console.warn("Warnings during conversion:", warnings);
    }
    
    // Add comprehensive styling to match Word document appearance
    htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Converted Document</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Calibri:ital,wght@0,400;0,700;1,400;1,700&family=Times+New+Roman:ital,wght@0,400;0,700;1,400;1,700&family=Arial:ital,wght@0,400;0,700;1,400;1,700&display=swap');
          
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            line-height: 1.5;
            margin: 2.54cm; /* Default Word margins */
            color: #000000;
            font-size: 11pt; /* Standard Word font size */
          }
          
          /* Heading styles that match Word defaults */
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Calibri', 'Arial', sans-serif;
            margin-top: 12pt;
            margin-bottom: 6pt;
            font-weight: bold;
            line-height: 1.2;
            page-break-after: avoid;
          }
          
          h1 { font-size: 16pt; color: #2E74B5; } /* Word Heading 1 */
          h2 { font-size: 14pt; color: #2E74B5; } /* Word Heading 2 */
          h3 { font-size: 13pt; color: #1F4D78; } /* Word Heading 3 */
          h4 { font-size: 12pt; color: #2E74B5; font-style: italic; } /* Word Heading 4 */
          h5 { font-size: 11pt; color: #2E74B5; } /* Word Heading 5 */
          h6 { font-size: 11pt; color: #1F4D78; font-style: italic; } /* Word Heading 6 */
          
          h1.title {
            font-size: 26pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 16pt;
          }
          
          h2.subtitle {
            font-size: 18pt;
            font-weight: normal;
            text-align: center;
            margin-bottom: 24pt;
            color: #404040;
          }
          
          p {
            margin: 0;
            margin-bottom: 8pt;
            text-align: left;
          }
          
          /* Word default paragraph spacing */
          p + p {
            margin-top: 0;
          }
          
          /* Table styling to match Word */
          table.doc-table {
            border-collapse: collapse;
            width: 100%;
            margin: 12pt 0;
            font-size: 11pt;
            border: 1px solid #000000;
            table-layout: fixed;
            page-break-inside: auto;
          }
          
          /* Ensure all tables preserve formatting (even if class is missing) */
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 12pt 0;
            font-size: 11pt;
            border: 1px solid #000000;
            table-layout: fixed;
            page-break-inside: auto;
          }
          
          /* Table cell styling */
          table.doc-table th, 
          table.doc-table td,
          table th,
          table td {
            border: 1px solid #000000;
            padding: 5pt;
            text-align: left;
            vertical-align: top;
            word-wrap: break-word;
            page-break-inside: avoid;
          }
          
          /* Table header styling */
          table.doc-table th,
          table th {
            background-color: #D9E2F3; /* Light blue header background */
            font-weight: bold;
          }
          
          /* Ensure tables don't break across pages if possible */
          tr {
            page-break-inside: avoid;
          }
          
          thead {
            display: table-header-group;
          }
          
          tfoot {
            display: table-footer-group;
          }
          
          /* List styling */
          ul, ol {
            margin-top: 0;
            margin-bottom: 8pt;
            padding-left: 40px;
          }
          
          li {
            margin-bottom: 4pt;
          }
          
          /* Text formatting */
          strong, b {
            font-weight: bold;
          }
          
          em, i {
            font-style: italic;
          }
          
          u {
            text-decoration: underline;
          }
          
          a {
            color: #0563C1; /* Word hyperlink color */
            text-decoration: underline;
          }
          
          /* Image handling */
          img {
            max-width: 100%;
            height: auto;
            margin: 8pt 0;
          }
          
          /* Page break control */
          .pagebreak {
            page-break-before: always;
          }
          
          /* Default Word indentation for paragraphs */
          .indented {
            text-indent: 36pt; /* First line indent */
          }
          
          /* Columns if needed */
          .two-columns {
            column-count: 2;
            column-gap: 20px;
          }
          
          /* Proper page setup for printing */
          @page {
            size: A4;
            margin: 2.54cm; /* Standard Word margins */
          }
          
          /* Override any browser print settings */
          @media print {
            html, body {
              width: 210mm;
              height: 297mm;
              margin: 0;
              padding: 0;
            }
            body {
              padding: 2.54cm;
              box-sizing: border-box;
            }
          }
          
          /* Ensure proper rendering of Word-specific elements */
          .preserve-whitespace {
            white-space: pre-wrap;
          }
          
          /* Additional specific Word styling */
          .text-center {
            text-align: center;
          }
          
          .text-right {
            text-align: right;
          }
          
          .text-justify {
            text-align: justify;
          }
          
          /* Document header/footer if needed */
          .header {
            position: running(header);
            text-align: right;
            font-size: 9pt;
            color: #666;
          }
          
          .footer {
            position: running(footer);
            text-align: center;
            font-size: 9pt;
            color: #666;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
    
    // Write HTML to file
    fs.writeFileSync(htmlPath, htmlContent);
    
    // Convert HTML to PDF using Puppeteer with optimized settings
    const pdfBuffer = await convertHtmlToPdf(htmlPath);
    
    // Set response headers for PDF file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="converted-document.pdf"`);
    
    // Send the PDF buffer
    res.send(pdfBuffer);
    
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

// Function to convert HTML to PDF using Puppeteer with enhanced settings
async function convertHtmlToPdf(htmlPath) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--font-render-hinting=none' // Better font rendering
    ]
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport to match A4 paper size for better rendering
    await page.setViewport({
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
      deviceScaleFactor: 2 // Higher resolution for better quality
    });
    
    // Add custom font handling to ensure proper rendering
    await page.evaluateOnNewDocument(() => {
      document.fonts && document.fonts.ready.then(() => {
        // Ensure fonts are loaded before rendering
        document.body.classList.add('fonts-loaded');
      });
    });
    
    // Load HTML file
    await page.goto(`file://${htmlPath}`, { 
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000 // Longer timeout for complex documents
    });
    
    // Wait for any potential JavaScript and fonts to load
    await page.waitForFunction(() => {
      return document.fonts ? document.fonts.ready : true;
    }, { timeout: 5000 }).catch(() => console.log('Font loading timed out, continuing...'));
    
    // Add additional styles to help with exact formatting match
    await page.addStyleTag({
      content: `
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        @media print {
          body { -webkit-print-color-adjust: exact !important; }
        }
      `
    });
    
    // Generate PDF with settings optimized for Word-like output
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0'
      },
      scale: 1,
      landscape: false,
      omitBackground: false,
      timeout: 60000 // Longer timeout for PDF generation
    });
    
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

module.exports = wordToPdfController;