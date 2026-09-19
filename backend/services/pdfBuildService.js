const PDFDocument = require('pdfkit');

function addSectionTitle(doc, title) {
  doc.moveDown(0.6);
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#1e3a5f').text(title.toUpperCase());
  doc
    .moveTo(50, doc.y + 2)
    .lineTo(545, doc.y + 2)
    .strokeColor('#c5d0dc')
    .stroke();
  doc.moveDown(0.4);
  doc.fillColor('#1f2933').font('Helvetica').fontSize(10);
}

function buildTailoredPdf(tailoredResume) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'LETTER' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const r = tailoredResume || {};

    doc.font('Helvetica-Bold').fontSize(20).fillColor('#12263a').text(r.name || 'Resume');
    if (r.contact) {
      doc.moveDown(0.2);
      doc.font('Helvetica').fontSize(10).fillColor('#4b5563').text(r.contact);
    }

    if (r.summary) {
      addSectionTitle(doc, 'Summary');
      doc.font('Helvetica').fontSize(10).fillColor('#1f2933').text(r.summary, { align: 'left' });
    }

    if (Array.isArray(r.skills) && r.skills.length) {
      addSectionTitle(doc, 'Skills');
      doc.font('Helvetica').fontSize(10).text(r.skills.join(' · '));
    }

    if (Array.isArray(r.experience) && r.experience.length) {
      addSectionTitle(doc, 'Experience');
      r.experience.forEach((item) => {
        doc.font('Helvetica-Bold').fontSize(11).fillColor('#12263a').text(item.title || '');
        const meta = [item.company, item.dates].filter(Boolean).join('  |  ');
        if (meta) doc.font('Helvetica').fontSize(9).fillColor('#4b5563').text(meta);
        (item.bullets || []).forEach((bullet) => {
          doc.font('Helvetica').fontSize(10).fillColor('#1f2933').text(`•  ${bullet}`, {
            indent: 8
          });
        });
        doc.moveDown(0.35);
      });
    }

    if (Array.isArray(r.projects) && r.projects.length) {
      addSectionTitle(doc, 'Projects');
      r.projects.forEach((item) => {
        doc.font('Helvetica-Bold').fontSize(11).fillColor('#12263a').text(item.name || '');
        if (item.description) {
          doc.font('Helvetica').fontSize(10).fillColor('#1f2933').text(item.description);
        }
        (item.bullets || []).forEach((bullet) => {
          doc.font('Helvetica').fontSize(10).text(`•  ${bullet}`, { indent: 8 });
        });
        doc.moveDown(0.35);
      });
    }

    if (Array.isArray(r.education) && r.education.length) {
      addSectionTitle(doc, 'Education');
      r.education.forEach((item) => {
        doc.font('Helvetica-Bold').fontSize(11).fillColor('#12263a').text(item.degree || '');
        const meta = [item.school, item.dates].filter(Boolean).join('  |  ');
        if (meta) doc.font('Helvetica').fontSize(9).fillColor('#4b5563').text(meta);
        if (item.details) doc.font('Helvetica').fontSize(10).fillColor('#1f2933').text(item.details);
        doc.moveDown(0.3);
      });
    }

    if (Array.isArray(r.certifications) && r.certifications.length) {
      addSectionTitle(doc, 'Certifications');
      r.certifications.forEach((item) => {
        doc.font('Helvetica').fontSize(10).fillColor('#1f2933').text(`•  ${item}`);
      });
    }

    if (r.other) {
      addSectionTitle(doc, 'Additional');
      doc.font('Helvetica').fontSize(10).fillColor('#1f2933').text(r.other);
    }

    doc.end();
  });
}

module.exports = { buildTailoredPdf };
