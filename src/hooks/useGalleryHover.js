import { useState, useEffect } from 'react';
import { GALLERY_HOVER_MS } from '../lib/productImages.js';

/** Same hover cycle as product detail: advance from (selected + 1) every GALLERY_HOVER_MS. */
export function useGalleryHover(productImages, selectedImage = 0) {
  const [galleryHovered, setGalleryHovered] = useState(false);
  const [hoverImageIndex, setHoverImageIndex] = useState(0);

  useEffect(() => {
    if (!galleryHovered || productImages.length <= 1) {
      setHoverImageIndex(selectedImage);
      return undefined;
    }

    let idx = (selectedImage + 1) % productImages.length;
    setHoverImageIndex(idx);
    const interval = setInterval(() => {
      idx = (idx + 1) % productImages.length;
      setHoverImageIndex(idx);
    }, GALLERY_HOVER_MS);

    return () => clearInterval(interval);
  }, [galleryHovered, productImages, selectedImage]);

  const activeImageIndex =
    galleryHovered && productImages.length > 1 ? hoverImageIndex : selectedImage;

  const galleryHoverHandlers = {
    onMouseEnter: () => setGalleryHovered(true),
    onMouseLeave: () => {
      setGalleryHovered(false);
      setHoverImageIndex(selectedImage);
    },
  };

  return {
    activeImageIndex,
    galleryHovered,
    hoverImageIndex,
    setHoverImageIndex,
    galleryHoverHandlers,
  };
}
