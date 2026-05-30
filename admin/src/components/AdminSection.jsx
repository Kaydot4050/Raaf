import { cn } from '@/lib/utils';

const panelToneClass = {
  cream: 'admin-panel-cream',
  sage: 'admin-panel-sage',
  wheat: 'admin-panel-wheat',
  gold: 'admin-panel-gold',
  earth: 'admin-panel-cream',
};

export default function AdminSection({
  title,
  description,
  actions,
  children,
  className,
  tone,
}) {
  return (
    <section
      className={cn(tone ? panelToneClass[tone] || 'admin-panel' : 'admin-panel', 'gap-4', className)}
    >
      {title || description || actions ? (
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            {title ? <h2 className="text-base font-medium">{title}</h2> : null}
            {description ? (
              <div className="text-sm text-muted-foreground">{description}</div>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
