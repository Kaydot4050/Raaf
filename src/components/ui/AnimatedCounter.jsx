import { useEffect, useRef, useState } from 'react';
import { useInView, motion } from 'framer-motion';

export default function AnimatedCounter({ value, suffix = '', prefix = '', duration = 2, from = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!inView) return;
    const end = typeof value === 'number' ? value : parseInt(String(value).replace(/\D/g, ''), 10) || 0;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(from + eased * (end - from));
      setCount(current);
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(end);
    };
    requestAnimationFrame(tick);
  }, [inView, value, duration, from]);

  return (
    <motion.span ref={ref} className="tabular-nums">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </motion.span>
  );
}
