import { cn } from '@/lib/utils';
import { SITE_URL } from '../lib/api.js';

const LOGO_PATH = '/images/cropped-cropped-gooo-1-1.png';

export const ADMIN_LOGO_SRC = import.meta.env.DEV
  ? LOGO_PATH
  : `${SITE_URL.replace(/\/$/, '')}${LOGO_PATH}`;

export default function AdminLogo({ className, imageClassName, showText = true, subtitle = 'Admin' }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <img
        src={ADMIN_LOGO_SRC}
        alt="Raafortagro"
        className={cn('size-9 shrink-0 object-contain', imageClassName)}
      />
      {showText ? (
        <div className="min-w-0">
          <p className="font-display truncate text-sm font-semibold tracking-tight lowercase text-sidebar-foreground">
            raafortagro
          </p>
          {subtitle ? (
            <p className="text-[11px] text-sidebar-foreground/65">{subtitle}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
