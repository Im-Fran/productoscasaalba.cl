import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import gsap from 'gsap';
import { usePopularProducts } from '@/hooks/usePopularProducts';
import type { Product } from '@/types/product';

export const FloatingProductsAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { products, loading } = usePopularProducts(8);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !products.length || !containerRef.current) return;

    // Only run on desktop (width >= 1024px)
    if (window.innerWidth < 1024) return;

    const container = containerRef.current;
    const images = container.querySelectorAll('.floating-product');

    // Calculate center content area (max-w-4xl = 1024px + padding)
    const centerContentWidth = 1024 + 64; // 1024px + 2rem padding on each side
    const centerStart = (window.innerWidth - centerContentWidth) / 2;
    const centerEnd = centerStart + centerContentWidth;
    
    // Margin areas where products can appear
    const leftMarginEnd = Math.max(centerStart - 50, 50);
    const rightMarginStart = Math.min(centerEnd + 50, window.innerWidth - 150);

    images.forEach((img, index) => {
      const element = img as HTMLElement;
      
      // All products start from bottom of screen
      const startY = window.innerHeight + 100;
      
      // Determine if this product goes to left or right margin
      const isLeftSide = index % 2 === 0;
      
      // Random X position in the appropriate margin
      let startX: number;
      let endX: number;
      
      if (isLeftSide) {
        // Left margin: from left edge to before center content
        startX = Math.random() * Math.max(leftMarginEnd - 150, 100) + 25;
        endX = Math.random() * Math.max(leftMarginEnd - 150, 100) + 25;
      } else {
        // Right margin: from after center content to right edge
        startX = rightMarginStart + Math.random() * (window.innerWidth - rightMarginStart - 150);
        endX = rightMarginStart + Math.random() * (window.innerWidth - rightMarginStart - 150);
      }
      
      // Random end Y position (higher up on screen)
      const endY = Math.random() * (window.innerHeight * 0.5) + 100;
      
      // Set initial position
      gsap.set(element, {
        x: startX,
        y: startY,
        opacity: 0,
        scale: 0.3,
      });
      
      // Create animation timeline with delay
      const tl = gsap.timeline({
        delay: index * 0.4, // Stagger the animations
        repeat: -1, // Infinite loop
        repeatDelay: 2,
      });
      
      // Animate in - jump upward from bottom
      tl.to(element, {
        x: endX,
        y: endY,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'back.out(1.2)',
      })
      // Float animation
      .to(element, {
        y: '+=20',
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 2,
      })
      // Animate out
      .to(element, {
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
        ease: 'power2.in',
      });
    });

    // Cleanup function
    return () => {
      gsap.killTweensOf('.floating-product');
    };
  }, [products, loading]);

  const handleProductClick = (product: Product) => {
    navigate(`/productos/${product.slug}`);
  };

  // Don't render on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    return null;
  }

  if (loading || !products.length) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    >
      {products.map((product) => {
        const imageUrl = product.images?.[0]?.src || '';
        
        return (
          <div
            key={product.id}
            className="floating-product absolute w-24 h-24 cursor-pointer pointer-events-auto"
            onClick={() => handleProductClick(product)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleProductClick(product);
              }
            }}
            title={product.name}
          >
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            />
          </div>
        );
      })}
    </div>
  );
};
