import media from '../data/generatedMedia.json';

export default function ResponsiveImage({ src, alt, sizes = '(min-width: 1024px) 400px, 100vw', label, fit, ...props }) {
  const entry = media[src];
  return <picture data-fit={fit}>
    {entry && <source type="image/webp" srcSet={entry.variants.map(item => `${item.src} ${item.width}w`).join(', ')} sizes={sizes} />}
    <img src={src} alt={alt || label || ''} width={entry?.width} height={entry?.height} decoding="async" {...props} />
  </picture>;
}
