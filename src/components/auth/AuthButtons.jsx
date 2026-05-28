import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';

export default function AuthButtons({ stacked = false, onNavigate }) {
  const wrap = stacked ? 'flex flex-col gap-2 w-full' : 'flex items-center gap-2';

  return (
    <div className={wrap}>
      <Link
        to="/login"
        onClick={onNavigate}
        className={
          stacked
            ? 'w-full inline-flex items-center justify-center px-5 py-3 rounded-full text-sm font-semibold text-charcoal border border-border bg-white hover:bg-beige-soft transition-colors min-h-[44px]'
            : 'inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold text-charcoal hover:text-forest transition-colors min-h-[44px]'
        }
      >
        Log in
      </Link>
      <Button
        to="/register"
        variant="forest"
        size="sm"
        className={stacked ? 'w-full justify-center' : ''}
        onClick={onNavigate}
      >
        Sign up
      </Button>
    </div>
  );
}
