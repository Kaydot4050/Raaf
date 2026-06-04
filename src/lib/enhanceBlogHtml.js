/**
 * Normalize blog HTML: wrap <p><img></p> in figure containers.
 * Posts should use <figure class="ra-img-wrap ra-img-left|right|center|wide"> for layout control.
 */
export function enhanceBlogHtml(html) {
  if (!html) return '';

  return html.replace(
    /<p>\s*<img([^>]*?)\s*\/?>\s*<\/p>/gi,
    (_, attrs) => figureFromImgAttrs(attrs, 'center'),
  );
}

function figureFromImgAttrs(attrs, layout) {
  const capMatch = attrs.match(/data-caption="([^"]*)"/);
  const caption = capMatch ? `<figcaption>${capMatch[1]}</figcaption>` : '';
  const cleanAttrs = attrs.replace(/\s*data-caption="[^"]*"/, '');
  return `<figure class="ra-img-wrap ra-img-${layout}"><img${cleanAttrs} loading="lazy" />${caption}</figure>`;
}
