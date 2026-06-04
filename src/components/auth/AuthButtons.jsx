import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';

const btnClass =
  'inline-flex items-center justify-center rounded-full bg-forest text-white shadow-md shadow-forest/25 hover:bg-forest-light transition-colors active:scale-[0.98]';

function LoginUserSvg({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.31 0-6 1.79-6 4v1h12v-1c0-2.21-2.69-4-6-4Z" />
    </svg>
  );
}

export default function AuthButtons({ stacked = false, compact = false, onNavigate }) {
  if (compact) {
    return (
      <Link
        to="/login"
        onClick={onNavigate}
        aria-label="Login"
        className={`${btnClass} h-10 w-10 shrink-0`}
      >
        <LoginUserSvg />
      </Link>
    );
  }

  const wrap = stacked ? 'flex flex-col gap-2 w-full' : 'flex items-center';

  return (
    <div className={wrap}>
      {stacked ? (
        <Button
          to="/login"
          variant="forest"
          size="md"
          className="w-full justify-center"
          onClick={onNavigate}
        >
          Log in
        </Button>
      ) : (
        <Link
          to="/login"
          onClick={onNavigate}
          aria-label="Login"
          className={`${btnClass} h-11 w-11`}
        >
          <LoginUserSvg className="h-7 w-7" />
        </Link>
      )}
    </div>
  );
}
