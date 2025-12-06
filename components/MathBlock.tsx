import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathBlockProps {
  latex: string;
  block?: boolean;
  className?: string;
}

const MathBlock: React.FC<MathBlockProps> = ({ latex, block = false, className = '' }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(latex, containerRef.current, {
          throwOnError: false,
          displayMode: block,
          output: 'html', // Use HTML output for better accessibility and rendering
          strict: false,  // Be less strict about LaTeX conformity
        });
      } catch (error: any) {
        // Silently handle quirks mode error by falling back to text
        if (error && error.message && error.message.includes('quirks mode')) {
          console.warn('KaTeX requires Standards Mode (<!DOCTYPE html>). Falling back to text display.');
        } else {
          console.error('KaTeX rendering error:', error);
        }
        // Fallback to displaying raw LaTeX
        containerRef.current.innerText = latex;
      }
    }
  }, [latex, block]);

  // Use 'inherit' for color so it adapts to dark/light mode parents
  return <span ref={containerRef} className={`math-font ${className}`} style={{ color: 'inherit' }} dir="ltr" />;
};

export default MathBlock;