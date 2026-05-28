import { useRef } from 'react';
import { useInView } from 'framer-motion';

export default function AnimatedProgressBar({
  percent = 75,
  duration = 2,
  trackClassName = '',
  barClassName = '',
  className = '',
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div
      ref={ref}
      className={`w-full overflow-hidden rounded-full ${trackClassName} ${className}`}
    >
      <div
        className={`h-full rounded-full ${barClassName}`}
        style={{
          width: inView ? `${percent}%` : '0%',
          transitionProperty: 'width',
          transitionDuration: `${duration}s`,
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </div>
  );
}
