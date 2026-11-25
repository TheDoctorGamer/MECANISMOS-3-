// Utilidades de maquetación para el resumen (docx-js 9.x)
const fs = require('fs');
const path = require('path');
const {
  Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, AlignmentType, VerticalAlign, TableLayoutType, HeightRule,
} = require('docx');

const C = {
  title: 'DDF4F7', topic: 'E8E0F6', sub: 'DCECFB', pink: 'F6DCE7', key: 'FFF1B7',
  mint: 'DDF0DD', peach: 'F7E1C8', navy: '202C45', border: '9AA5B8', zebra: 'F7F8FC',
};
const ACC = { key: 'C9A227', mint: '5E9E5E', peach: 'C47F35', sub: '5A86C0', topic: '8A74C0', pink: 'C9789A' };

// Geometría (DXA): carta, márgenes 0,5 cm, 2 columnas de 9,67 cm, separación 1,25 cm
const G = { PW: 12240, PH: 15840, M: 284, SPACE: 709 };
G.TW = G.PW - 2 * G.M;                 // 11672 = 20,59 cm
G.CW = Math.floor((G.TW - G.SPACE) / 2); // 5481 = 9,67 cm
const PX = (dxa) => Math.floor(dxa / 1440 * 96);

const sh = (fill) => ({ type: ShadingType.CLEAR, fill, color: 'auto' });

// Mini-marcado: **negrita**, [[clave amarilla]], {{subdivisión rosa}}, ~~inmunología menta~~,
// __cursiva__, ^^superíndice^^, ,,subíndice,,
function runs(md, base = {}) {
  const parts = String(md).split(/(\*\*[^*]+\*\*|\[\[[^\]]+\]\]|\{\{[^}]+\}\}|~~[^~]+~~|__[^_]+__|\^\^[^^]+\^\^|,,[^,]+,,)/g).filter((p) => p !== '');
  return parts.map((p) => {
    if (p.startsWith('**')) return new TextRun({ ...base, text: p.slice(2, -2), bold: true });
    if (p.startsWith('[[')) return new TextRun({ ...base, text: p.slice(2, -2), bold: true, shading: sh(C.key) });
    if (p.startsWith('{{')) return new TextRun({ ...base, text: p.slice(2, -2), bold: true, shading: sh(C.pink) });
    if (p.startsWith('~~')) return new TextRun({ ...base, text: p.slice(2, -2), bold: true, shading: sh(C.mint) });
    if (p.startsWith('__')) return new TextRun({ ...base, text: p.slice(2, -2), italics: true });
    if (p.startsWith('^^')) return new TextRun({ ...base, text: p.slice(2, -2), superScript: true });
    if (p.startsWith(',,')) return new TextRun({ ...base, text: p.slice(2, -2), subScript: true });
    return new TextRun({ ...base, text: p });
  });
}

const P = (md, o = {}) => new Paragraph({ children: runs(md, o.run || {}), ...o, run: undefined });
const B = (md, level = 0, o = {}) => new Paragraph({ children: runs(md, o.run || {}), numbering: { reference: 'vinetas', level }, ...o, run: undefined });
const H1 = (t) => new Paragraph({ text: t, style: 'Heading1' });
const H2 = (t) => new Paragraph({ text: t, style: 'Heading2' });
const H3 = (t) => new Paragraph({ text: t, style: 'Heading3' });
const CAP = (md) => new Paragraph({ children: runs(md), style: 'Leyenda' });

function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), data: b };
}
function img(file, widthPx, alt) {
  const { w, h, data } = pngSize(file);
  const height = Math.round(widthPx * h / w);
  return new ImageRun({
    type: 'png', data, transformation: { width: widthPx, height },
    altText: { title: alt || path.basename(file), description: alt || path.basename(file), name: path.basename(file) },
  });
}
// Figura en párrafo propio + leyenda
function FIG(file, widthPx, caption, alt) {
  return [
    new Paragraph({ children: [img(file, widthPx, alt || caption)], alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 40, after: 20 } }),
    CAP(caption),
  ];
}

const thin = (color = C.border, size = 4) => ({ style: BorderStyle.SINGLE, size, color });
const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NOB = { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none };

// Contenido de celda: string md | array de md ("• " = viñeta)
function cellParas(content, style, align, keepNext) {
  const arr = Array.isArray(content) ? content : [content];
  return arr.map((md) => {
    if (md instanceof Paragraph) return md;
    if (typeof md === 'string' && md.startsWith('• ')) {
      return new Paragraph({ children: runs(md.slice(2)), style, keepNext, numbering: { reference: 'vinetasTabla', level: 0 } });
    }
    return new Paragraph({ children: runs(md), style, alignment: align, keepNext });
  });
}

// Tabla nativa: encabezado azul marino, texto blanco negrita, bordes finos, filas compactas
function TABLE(widths, header, rows, o = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  const nrows = rows.length;
  const keep = o.keepTogether === true;
  const mk = (cells, isHead, ri) => new TableRow({
    tableHeader: isHead, cantSplit: true,
    children: cells.map((c, ci) => {
      const cfg = (c && typeof c === 'object' && !Array.isArray(c) && !(c instanceof Paragraph)) ? c : { md: c };
      let fill = isHead ? C.navy : (cfg.fill || (o.firstColFill && ci === 0 ? o.firstColFill : (o.zebra && ri % 2 ? C.zebra : undefined)));
      const span = cfg.span || 1;
      const w = widths.slice(ci, ci + span).reduce((a, b) => a + b, 0);
      return new TableCell({
        width: { size: w, type: WidthType.DXA }, columnSpan: span > 1 ? span : undefined,
        shading: fill ? sh(fill) : undefined,
        verticalAlign: cfg.valign || (isHead ? VerticalAlign.CENTER : VerticalAlign.TOP),
        margins: { top: 25, bottom: 25, left: 70, right: 70 },
        children: cellParas(cfg.md, isHead ? 'TablaEncabezado' : (cfg.style || 'TablaTexto'), cfg.align || (isHead ? AlignmentType.CENTER : undefined), keep && (isHead || ri < nrows - 1) ? true : undefined),
      });
    }),
  });
  const trs = [];
  if (header) trs.push(mk(header, true, 0));
  rows.forEach((r, i) => trs.push(mk(r, false, i)));
  return new Table({
    width: { size: total, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED,
    alignment: AlignmentType.CENTER,
    borders: { top: thin(), bottom: thin(), left: thin(), right: thin(), insideHorizontal: thin(), insideVertical: thin() },
    rows: trs,
  });
}

// Caja de color (tabla de una celda): kind = key | mint | peach | sub
function BOX(kind, title, items, width) {
  const fill = { key: C.key, mint: C.mint, peach: C.peach, sub: C.sub, topic: C.topic, pink: C.pink }[kind];
  const acc = ACC[kind];
  const children = [];
  if (title) children.push(new Paragraph({ children: [new TextRun({ text: title, bold: true, color: acc === ACC.key ? '7A5C00' : acc, size: 16, font: 'Arial Nova' })], spacing: { after: 20 }, keepNext: true }));
  items.forEach((md) => {
    if (md instanceof Paragraph) { children.push(md); return; }
    if (md instanceof Table) { children.push(md); children.push(new Paragraph({ children: [], spacing: { before: 0, after: 0, line: 60, lineRule: 'exact' } })); return; }
    if (md.startsWith('• ')) children.push(new Paragraph({ children: runs(md.slice(2)), style: 'CajaTexto', numbering: { reference: 'vinetasTabla', level: 0 } }));
    else children.push(new Paragraph({ children: runs(md), style: 'CajaTexto' }));
  });
  return new Table({
    width: { size: width, type: WidthType.DXA }, columnWidths: [width], layout: TableLayoutType.FIXED,
    borders: { top: thin(acc, 4), bottom: thin(acc, 4), right: thin(acc, 4), left: thin(acc, 24), insideHorizontal: none, insideVertical: none },
    rows: [new TableRow({ cantSplit: true, children: [new TableCell({ width: { size: width, type: WidthType.DXA }, shading: sh(fill), margins: { top: 50, bottom: 50, left: 110, right: 90 }, children })] })],
  });
}

// Fila de figuras sin bordes: items = [{file, w, sub}], ancho total en DXA
function FIGROW(items, width, caption) {
  const n = items.length;
  const cw = items.map((it) => it.cw || Math.floor(width / n));
  const fix = width - cw.reduce((a, b) => a + b, 0); cw[n - 1] += fix;
  const t = new Table({
    width: { size: width, type: WidthType.DXA }, columnWidths: cw, layout: TableLayoutType.FIXED,
    alignment: AlignmentType.CENTER, borders: NOB,
    rows: [new TableRow({
      cantSplit: true,
      children: items.map((it, i) => new TableCell({
        width: { size: cw[i], type: WidthType.DXA }, borders: { top: none, bottom: none, left: none, right: none },
        verticalAlign: it.valign || VerticalAlign.BOTTOM, margins: { top: 20, bottom: 10, left: 40, right: 40 },
        children: it.children ? it.children : [
          new Paragraph({ children: [img(it.file, it.w, it.alt || it.sub || caption)], alignment: AlignmentType.CENTER, keepNext: true }),
          ...(it.sub ? [new Paragraph({ children: runs(it.sub), style: 'Leyenda', spacing: { after: 0 }, keepNext: true })] : []),
        ],
      })),
    })],
  });
  const out = [t];
  if (caption) out.push(CAP(caption));
  return out;
}

// Diagrama de proceso. vertical: pasos apilados con flechas ▼; horizontal: pasos con ►
function FLOW(steps, width, o = {}) {
  const fills = o.fills || steps.map(() => o.fill || C.sub);
  if (o.vertical) {
    const rows = [];
    steps.forEach((s, i) => {
      rows.push(new TableRow({ cantSplit: true, children: [new TableCell({
        width: { size: width, type: WidthType.DXA }, shading: sh(fills[i]),
        borders: { top: thin(o.acc || ACC.sub), bottom: thin(o.acc || ACC.sub), left: thin(o.acc || ACC.sub, 18), right: thin(o.acc || ACC.sub) },
        margins: { top: 30, bottom: 30, left: 90, right: 70 },
        children: cellParas(s, 'TablaTexto'),
      })] }));
      if (i < steps.length - 1) {
        rows.push(new TableRow({ cantSplit: true, height: { value: 170, rule: HeightRule.EXACT }, children: [new TableCell({
          width: { size: width, type: WidthType.DXA }, borders: { top: none, bottom: none, left: none, right: none },
          margins: { top: 0, bottom: 0, left: 0, right: 0 },
          children: [new Paragraph({ children: [new TextRun({ text: '▼', size: 13, color: o.acc || ACC.sub })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0, line: 170, lineRule: 'exact' } })],
        })] }));
      }
    });
    return new Table({ width: { size: width, type: WidthType.DXA }, columnWidths: [width], layout: TableLayoutType.FIXED, alignment: AlignmentType.CENTER, borders: NOB, rows });
  }
  const arrowW = o.arrowW || 260;
  const n = steps.length;
  const sw = Math.floor((width - arrowW * (n - 1)) / n);
  const widths = [];
  steps.forEach((s, i) => { widths.push(sw); if (i < n - 1) widths.push(arrowW); });
  widths[widths.length - 1] += width - widths.reduce((a, b) => a + b, 0);
  const cells = [];
  steps.forEach((s, i) => {
    cells.push(new TableCell({
      width: { size: widths[cells.length], type: WidthType.DXA }, shading: sh(fills[i]), verticalAlign: VerticalAlign.CENTER,
      borders: { top: thin(o.acc || ACC.sub), bottom: thin(o.acc || ACC.sub), left: thin(o.acc || ACC.sub), right: thin(o.acc || ACC.sub) },
      margins: { top: 30, bottom: 30, left: 60, right: 60 },
      children: cellParas(s, 'TablaTexto', AlignmentType.CENTER),
    }));
    if (i < n - 1) {
      cells.push(new TableCell({
        width: { size: widths[cells.length], type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
        borders: { top: none, bottom: none, left: none, right: none }, margins: { top: 0, bottom: 0, left: 0, right: 0 },
        children: [new Paragraph({ children: [new TextRun({ text: '►', size: 16, color: o.acc || ACC.sub })], alignment: AlignmentType.CENTER })],
      }));
    }
  });
  return new Table({ width: { size: width, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED, alignment: AlignmentType.CENTER, borders: NOB, rows: [new TableRow({ cantSplit: true, children: cells })] });
}

const SP = (after = 60) => new Paragraph({ children: [], spacing: { before: 0, after, line: 120, lineRule: 'exact' } });

module.exports = { C, ACC, G, PX, sh, runs, P, B, H1, H2, H3, CAP, img, FIG, TABLE, BOX, FIGROW, FLOW, SP, thin, none, NOB };
