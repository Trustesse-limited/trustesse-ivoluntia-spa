'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RippleProps {
  x: number;
  y: number;
  size: number;
}

function Ripple({ x, y, size }: RippleProps) {
  return (
    <motion.div
      className="absolute bg-white/30 rounded-full pointer-events-none"
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
      }}
      initial={{ scale: 0, opacity: 0.5 }}
      animate={{ scale: 4, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    />
  );
}

interface RippleEffectProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export function RippleEffect({ children, disabled = false, className = '', onClick }: RippleEffectProps) {
  const [ripples, setRipples] = useState<RippleProps[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const addRipple = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (disabled || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    let clientX: number;
    let clientY: number;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const size = Math.max(rect.width, rect.height);

    const newRipple = { x, y, size };
    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r !== newRipple));
    }, 600);
  }, [disabled]);

  const handleClick = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    addRipple(event);
    if (onClick) {
      onClick();
    }
  }, [addRipple, onClick]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseDown={handleClick}
      onTouchStart={handleClick}
    >
      <AnimatePresence mode="popLayout">
        {ripples.map((ripple, index) => (
          <Ripple key={index} {...ripple} />
        ))}
      </AnimatePresence>
      {children}
    </div>
  );
}
