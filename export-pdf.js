const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

/**
 * HTML to PDF Exporter using Puppeteer (Headless Chrome)
 * 
 * Features:
 * - Pixel-perfect rendering using Chromium engine
 * - Full CSS support (gradients, shadows, modern fonts)
 * - Supports both URLs and local HTML files
 * - Customizable page size, margins, and options
 */

// Configuration
const config = {
  // Default output filename
  outputFile: 'output.pdf',
  
  // PDF options
  pdf: {
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '12mm',
      bottom: '12mm',
      left: '12mm',
      right: '12mm'
    }
  },
  
  // Page navigation options
  navigation: {
    waitUntil: 'networkidle0',
    timeout: 30000
  }
};

/**
 * Export a URL or HTML file to PDF
 * @param {string} source - URL or path to HTML file
 * @param {string} outputPath - Output PDF path
 * @param {object} options - Custom options to override defaults
 */
async function exportToPDF(source, outputPath = config.outputFile, options = {}) {
  console.log('🚀 Starting PDF export...');
  console.log(`📄 Source: ${source}`);
  console.log(`📁 Output: ${outputPath}`);
  
  let browser;
  
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--font-render-hinting=none'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2
    });
    
    // Determine if source is URL or file
    const isUrl = source.startsWith('http://') || source.startsWith('https://');
    const isFile = fs.existsSync(source);
    
    if (isUrl) {
      console.log('🌐 Loading URL...');
      await page.goto(source, config.navigation);
    } else if (isFile) {
      console.log('📂 Loading local file...');
      const absolutePath = path.resolve(source);
      const fileUrl = `file://${absolutePath}`;
      await page.goto(fileUrl, config.navigation);
    } else {
      // Treat as raw HTML content
      console.log('📝 Loading HTML content...');
      await page.setContent(source, config.navigation);
    }
    
    // Wait for fonts and images to load
    await page.evaluateHandle('document.fonts.ready');
    
    // Optional: Wait for specific element (useful for SPAs)
    if (options.waitForSelector) {
      console.log(`⏳ Waiting for selector: ${options.waitForSelector}`);
      await page.waitForSelector(options.waitForSelector, { timeout: 10000 });
    }
    
    // Optional: Additional delay for complex animations
    if (options.delay) {
      console.log(`⏳ Waiting ${options.delay}ms for animations...`);
      await new Promise(resolve => setTimeout(resolve, options.delay));
    }
    
    // Generate PDF
    console.log('📄 Generating PDF...');
    const pdfOptions = {
      path: outputPath,
      ...config.pdf,
      ...options.pdf
    };
    
    await page.pdf(pdfOptions);
    
    console.log('✅ PDF exported successfully!');
    console.log(`📍 Location: ${path.resolve(outputPath)}`);
    
    return path.resolve(outputPath);
    
  } catch (error) {
    console.error('❌ Error exporting PDF:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Export multiple pages to separate PDFs
 * @param {Array} pages - Array of {source, output} objects
 */
async function exportMultiple(pages) {
  console.log(`📚 Exporting ${pages.length} pages...`);
  
  const results = [];
  for (const page of pages) {
    try {
      const result = await exportToPDF(page.source, page.output, page.options);
      results.push({ success: true, path: result });
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }
  
  return results;
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║              HTML to PDF Exporter v1.0.0                     ║
║           Pixel-perfect rendering with Puppeteer             ║
╚══════════════════════════════════════════════════════════════╝

Usage:
  node export-pdf.js <source> [output.pdf] [options]

Examples:
  node export-pdf.js http://localhost:3000/resume resume.pdf
  node export-pdf.js ./index.html output.pdf
  node export-pdf.js https://example.com page.pdf

Options:
  --delay=<ms>       Wait for animations (default: 0)
  --wait=<selector>  Wait for CSS selector before export
  --format=<size>    Page format: A4, Letter, Legal, etc.
  --landscape        Use landscape orientation
  --no-margin        Remove all margins

For programmatic usage, import the module:
  const { exportToPDF } = require('./export-pdf');
  await exportToPDF('http://localhost:3000', 'output.pdf');
`);
    return;
  }
  
  const source = args[0];
  let output = 'output.pdf';
  const options = { pdf: {} };
  
  // Parse arguments
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--delay=')) {
      options.delay = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--wait=')) {
      options.waitForSelector = arg.split('=')[1];
    } else if (arg.startsWith('--format=')) {
      options.pdf.format = arg.split('=')[1];
    } else if (arg === '--landscape') {
      options.pdf.landscape = true;
    } else if (arg === '--no-margin') {
      options.pdf.margin = { top: 0, bottom: 0, left: 0, right: 0 };
    } else if (arg.endsWith('.pdf')) {
      output = arg;
    }
  }
  
  await exportToPDF(source, output, options);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

// Export for programmatic use
module.exports = { exportToPDF, exportMultiple, config };
