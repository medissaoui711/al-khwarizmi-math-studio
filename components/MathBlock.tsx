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
        });
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        containerRef.current.innerText = latex;
      }
    }
  }, [latex, block]);

  return <span ref={containerRef} className={`math-font ${className}`} dir="ltr" />;
};

export default MathBlock;