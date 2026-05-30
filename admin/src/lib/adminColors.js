/** Purple-themed accent tones for admin UI. */
export const adminIconTones = {
  forest: 'bg-emerald-500/10 text-emerald-400',
  sage: 'bg-primary/10 text-primary',
  wheat: 'bg-amber-500/10 text-amber-400',
  earth: 'bg-orange-500/10 text-orange-400',
  gold: 'bg-yellow-500/10 text-yellow-400',
  beige: 'bg-muted text-muted-foreground',
};

export const adminSidebarIconTones = {
  wheat: 'bg-primary/15 text-primary',
  sage: 'bg-emerald-500/15 text-emerald-400',
  earth: 'bg-orange-500/15 text-orange-400',
  gold: 'bg-yellow-500/15 text-yellow-400',
  cream: 'bg-muted text-muted-foreground',
  forest: 'bg-emerald-500/15 text-emerald-400',
};

export const adminStatTones = {
  orders: 'bg-primary/10 text-primary',
  revenue: 'bg-emerald-500/10 text-emerald-400',
  customers: 'bg-blue-500/10 text-blue-400',
  pending: 'bg-amber-500/10 text-amber-400',
};

export const adminRowTones = {
  forest: 'bg-emerald-500/10 text-emerald-400',
  sage: 'bg-primary/10 text-primary',
  wheat: 'bg-amber-500/10 text-amber-400',
  earth: 'bg-orange-500/10 text-orange-400',
  gold: 'bg-yellow-500/10 text-yellow-400',
  beige: 'bg-muted text-muted-foreground',
};

/** Tinted panel backgrounds. */
export const adminContainerTones = {
  cream: 'bg-card border-border',
  sage: 'bg-card border-border',
  wheat: 'bg-card border-border',
  earth: 'bg-card border-border',
  gold: 'bg-card border-border',
};

/** Subtle row backgrounds for list items. */
export const adminRowSurfaces = [
  'bg-card border-border',
  'bg-card border-border',
  'bg-card border-border',
  'bg-card border-border',
  'bg-card border-border',
];

export function adminRowSurface(index) {
  return adminRowSurfaces[index % adminRowSurfaces.length];
}
