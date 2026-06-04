/** Build a blog image container for post HTML bodies. */
export function blogFigure(src, alt, layout = 'center', caption = '') {
  const cap = caption
    ? `<figcaption>${caption.replace(/"/g, '&quot;')}</figcaption>`
    : '';
  const safeAlt = alt.replace(/"/g, '&quot;');
  return `<figure class="ra-img-wrap ra-img-${layout}"><img src="${src}" alt="${safeAlt}" loading="lazy" />${cap}</figure>`;
}

/** Two images side by side (equal columns). */
export function blogFigureGrid(figures) {
  const inner = figures
    .map((f) => blogFigure(f.src, f.alt, 'center', f.caption || ''))
    .join('');
  return `<div class="ra-img-grid">${inner}</div>`;
}
