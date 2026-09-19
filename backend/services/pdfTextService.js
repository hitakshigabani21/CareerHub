const pdfParse = require('pdf-parse');

async function extractPdfText(buffer) {
  const data = await pdfParse(buffer);
  return (data.text || '').trim();
}

async function extractTextFromUpload(file) {
  if (!file) return '';

  if (file.mimetype === 'text/plain') {
    return file.buffer.toString('utf8').trim();
  }

  if (file.mimetype === 'application/pdf') {
    return extractPdfText(file.buffer);
  }

  return '';
}

async function extractPdfTextFromUrl(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw Object.assign(new Error('Could not download resume PDF'), { statusCode: 400 });
  }
  const arrayBuffer = await response.arrayBuffer();
  return extractPdfText(Buffer.from(arrayBuffer));
}

module.exports = {
  extractPdfText,
  extractTextFromUpload,
  extractPdfTextFromUrl
};
