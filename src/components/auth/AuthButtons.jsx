import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';

export default function AuthButtons({ stacked = false, onNavigate }) {
  const wrap = stacked ? 'flex flex-col gap-2 w-full' : 'flex items-center ml-8';

  return (
    <div className={wrap}>
      <Button
        to="/login"
        variant="forest"
        size="md"
        className={stacked ? 'w-full justify-center' : ''}
        onClick={onNavigate}
      >
        Log in
      </Button>
    </div>
  );
}
