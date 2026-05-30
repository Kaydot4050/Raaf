/** Brand-aligned accent tones for admin UI (matches public site palette). */
export const adminIconTones = {
  forest: 'bg-forest/10 text-forest',
  sage: 'bg-forest-light/15 text-forest-light',
  wheat: 'bg-wheat/25 text-accent',
  earth: 'bg-accent/15 text-accent',
  gold: 'bg-star/15 text-star',
  beige: 'bg-beige text-charcoal-light',
};

export const adminSidebarIconTones = {
  wheat: 'bg-sidebar-primary/20 text-sidebar-primary',
  sage: 'bg-forest-light/30 text-beige-soft',
  earth: 'bg-accent/30 text-beige-soft',
  gold: 'bg-star/25 text-star',
  cream: 'bg-sidebar-foreground/12 text-sidebar-foreground',
  forest: 'bg-forest-light/40 text-sidebar-foreground',
};

export const adminStatTones = {
  orders: adminIconTones.forest,
  revenue: adminIconTones.gold,
  customers: adminIconTones.sage,
  pending: adminIconTones.earth,
};

export const adminRowTones = {
  forest: `${adminIconTones.forest} group-hover:bg-forest/15`,
  sage: `${adminIconTones.sage} group-hover:bg-forest-light/20`,
  wheat: `${adminIconTones.wheat} group-hover:bg-wheat/35`,
  earth: `${adminIconTones.earth} group-hover:bg-accent/20`,
  gold: `${adminIconTones.gold} group-hover:bg-star/20`,
  beige: `${adminIconTones.beige} group-hover:bg-beige-dark/80`,
};

/** Tinted panel backgrounds (light brown, green, yellow). */
export const adminContainerTones = {
  cream: 'bg-beige-soft/90 border-beige/70 ring-beige/25',
  sage: 'bg-forest/[0.06] border-forest/20 ring-forest/10',
  wheat: 'bg-wheat/15 border-wheat/40 ring-wheat/20',
  earth: 'bg-accent/50 border-beige-dark/40 ring-beige/20',
  gold: 'bg-star/[0.08] border-star/30 ring-star/15',
};

/** Subtle row backgrounds for list items. */
export const adminRowSurfaces = [
  'bg-card border-border/80',
  'bg-beige-soft/80 border-beige/60',
  'bg-forest/[0.04] border-forest/15',
  'bg-wheat/10 border-wheat/30',
  'bg-star/[0.06] border-star/20',
];

export function adminRowSurface(index) {
  return adminRowSurfaces[index % adminRowSurfaces.length];
}
