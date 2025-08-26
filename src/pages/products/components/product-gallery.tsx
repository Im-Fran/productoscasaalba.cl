import {useState, useMemo, useRef, useCallback, type MouseEvent} from 'react';
import type {ProductImage} from "@/types/product";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter duplicate images based on unique IDs
  const uniqueImages = useMemo(() => {
    if (!images || images.length === 0) return [];

    const seen = new Set();
    return images.filter((image) => {
      if (seen.has(image.id)) {
        return false;
      }
      seen.add(image.id);
      return true;
    });
  }, [images]);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  }, [containerRef]);

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  if (!uniqueImages || uniqueImages.length === 0) {
    return (
      <div className="space-y-4">
        <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">Sin imagen disponible</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative overflow-hidden rounded-lg bg-white shadow-md">
        <div
          ref={containerRef}
          className="w-full h-[32rem] flex items-center justify-center bg-gray-50 cursor-zoom-in relative"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            ref={imageRef}
            src={uniqueImages[selectedImage]?.src || uniqueImages[0].src}
            alt={uniqueImages[selectedImage]?.alt || productName}
            className="max-w-full max-h-full object-contain"
          />

          {/* Zoom overlay */}
          {isZoomed && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url(${
                  uniqueImages[selectedImage]?.src || uniqueImages[0].src
                })`,
                backgroundSize: '125%',
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundRepeat: 'no-repeat',
                opacity: 1,
                mixBlendMode: 'normal',
              }}
            />
          )}
        </div>

        {/* Zoom icon */}
        <button className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          </svg>
        </button>
      </div>

      {/* Thumbnail gallery */}
      {uniqueImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {uniqueImages.map((image, index) => (
            <button
              key={`gallery-thumb-${image.id}`}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? 'border-mint-600 ring-2 ring-mint-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <img
                  src={image.thumbnail}
                  alt={image.alt || `${productName} - Vista ${index + 1}`}
                  className="max-w-full max-h-full object-contain transition-transform duration-200 hover:scale-105"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
