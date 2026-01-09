# 📄 HTML to PDF Exporter

Export HTML pages to PDF with **pixel-perfect rendering** using Puppeteer (Headless Chrome).
Example: https://matheus-schumacher.vercel.app/Matheus-Schumacher-Resume.html

## ✨ Features

- 🎨 **Pixel-perfect rendering** — Uses Chromium layout engine
- 🖼️ **Full CSS support** — Gradients, shadows, modern fonts, flexbox, grid
- 🌐 **Multiple sources** — URLs, local files, or raw HTML
- ⚙️ **Customizable** — Page size, margins, orientation
- 📚 **Batch export** — Export multiple pages at once
- 🔧 **CLI & API** — Use from command line or import in your code
- 🤖 **Anti-ATS Ready** — Resume templates optimized for Applicant Tracking Systems

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Export a webpage

```bash
# From URL
node export-pdf.js http://localhost:3000/resume resume.pdf

# From local HTML file
node export-pdf.js ./index.html output.pdf

# Full-bleed (no margins)
node export-pdf.js ./resume.html output.pdf --no-margin
```

## 📋 CLI Options

| Option | Description |
|--------|-------------|
| `--delay=<ms>` | Wait for animations before export |
| `--wait=<selector>` | Wait for CSS selector to appear |
| `--format=<size>` | Page format: A4, Letter, Legal, etc. |
| `--landscape` | Use landscape orientation |
| `--no-margin` | Remove all margins (edge-to-edge) |

### Examples

```bash
# Wait for animations
node export-pdf.js http://localhost:3000 output.pdf --delay=2000

# Wait for specific element
node export-pdf.js http://localhost:3000 output.pdf --wait=".content-loaded"

# Landscape Letter format
node export-pdf.js http://localhost:3000 output.pdf --format=Letter --landscape

# No margins (recommended for dark-themed resumes)
node export-pdf.js ./resume.html output.pdf --no-margin
```

## 🔧 Programmatic Usage

```javascript
const { exportToPDF, exportMultiple } = require('./export-pdf');

// Single export
await exportToPDF('http://localhost:3000/resume', 'resume.pdf', {
  delay: 1000,
  pdf: {
    format: 'A4',
    landscape: false
  }
});

// Batch export
await exportMultiple([
  { source: 'http://localhost:3000/page1', output: 'page1.pdf' },
  { source: 'http://localhost:3000/page2', output: 'page2.pdf' },
  { source: './local.html', output: 'local.pdf' }
]);
```

## 🤖 Anti-ATS Features

The included resume templates are optimized to pass Applicant Tracking Systems:

- **Schema.org JSON-LD** — Machine-readable structured data
- **Hidden Keywords** — Invisible text with relevant keywords for ATS parsing
- **Semantic HTML** — Proper tags (`<article>`, `<section>`, `<time>`)
- **Meta Tags** — SEO keywords and descriptions
- **ARIA Labels** — Accessibility attributes for ATS compatibility

## 📁 Included Templates

| Template | Description |
|----------|-------------|
| `nara_resume.html` | Feminine rose/gold theme for operations & customer service |

## ⚙️ Configuration

Edit the `config` object in `export-pdf.js`:

```javascript
const config = {
  outputFile: 'output.pdf',
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
  }
};
```

## 💡 Tips

- **For dark themes**: Use `--no-margin` to avoid white edges
- **For SPAs**: Use `--wait` to wait for content to load  
- **For animations**: Use `--delay` to let animations complete
- **For print styles**: CSS `@media print` rules are respected
- **For custom fonts**: Ensure fonts are loaded before export

## 📝 License

MIT © Matheus Schumacher
