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

    images.forEach((img, index) => {
      const element = img as HTMLElement;
      
      // Determine starting position (bottom, left, or right)
      const positions = ['bottom', 'left', 'right'];
      const position = positions[index % positions.length];
      
      // Set initial position off-screen
      let startX: number;
      let startY: number;
      
      if (position === 'bottom') {
        startX = Math.random() * (window.innerWidth - 150);
        startY = window.innerHeight + 100;
      } else if (position === 'left') {
        startX = -150;
        startY = Math.random() * (window.innerHeight - 300) + 100;
      } else { // right
        startX = window.innerWidth + 150;
        startY = Math.random() * (window.innerHeight - 300) + 100;
      }
      
      // Random end position in the viewport
      const endX = Math.random() * (window.innerWidth - 200) + 50;
      const endY = Math.random() * (window.innerHeight - 300) + 50;
      
      // Set initial position
      gsap.set(element, {
        x: startX,
        y: startY,
        opacity: 0,
        scale: 0.3,
      });
      
      // Create animation timeline with delay
      const tl = gsap.timeline({
        delay: index * 0.3, // Stagger the animations
        repeat: -1, // Infinite loop
        repeatDelay: 2,
      });
      
      // Animate in
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
