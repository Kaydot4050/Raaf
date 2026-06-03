import { useState, useEffect, useCallback } from 'react';
import { GALLERY_HOVER_MS } from '../lib/productImages.js';

/** Cycles gallery images on hover or touch — same behavior as product detail. */
export function useGalleryHover(productImages, selectedImage = 0) {
  const [galleryHovered, setGalleryHovered] = useState(false);
  const [hoverImageIndex, setHoverImageIndex] = useState(0);

  const stopHover = useCallback(() => {
    setGalleryHovered(false);
    setHoverImageIndex(selectedImage);
  }, [selectedImage]);

  const startHover = useCallback(() => {
    if (productImages.length > 1) setGalleryHovered(true);
  }, [productImages.length]);

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
    onMouseEnter: startHover,
    onMouseLeave: stopHover,
    onFocus: startHover,
    onBlur: stopHover,
    onTouchStart: startHover,
    onTouchEnd: stopHover,
    onTouchCancel: stopHover,
  };

  return {
    activeImageIndex,
    galleryHovered,
    hoverImageIndex,
    setHoverImageIndex,
    galleryHoverHandlers,
  };
}
