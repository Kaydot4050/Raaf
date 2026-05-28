import { Link } from 'react-router-dom';

const variants = {
  primary:
    'bg-beige text-charcoal shadow-md shadow-charcoal/5 hover:bg-beige-dark hover:-translate-y-0.5 border border-beige-dark/40',
  forest:
    'bg-forest text-white shadow-lg shadow-forest/20 hover:bg-forest-light hover:-translate-y-0.5',
  secondary:
    'bg-white text-charcoal border border-border hover:bg-cream-dark hover:-translate-y-0.5',
  outline:
    'border-2 border-white/90 text-white hover:bg-white hover:text-charcoal',
  ghost: 'text-charcoal hover:bg-cream-dark/60',
  dark: 'bg-charcoal text-white hover:bg-charcoal-light',
};

const sizes = {
  sm: 'px-5 py-2 text-xs',
  md: 'px-7 py-3 text-sm',
  lg: 'px-8 py-3.5 text-sm',
};

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  onClick,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-full tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest/30 min-h-[44px] active:scale-[0.98]';
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
