import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/shadcn-button.jsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';
import AdminPage from '../components/AdminPage.jsx';
import JsonContentEditor from '../components/JsonContentEditor.jsx';
import { sectionGroupLabel } from '../lib/fieldLabels.js';
import { adminApi } from '../lib/api.js';

const PAGE_LABELS = {
  global: 'Global (header & footer)',
  home: 'Home page',
  about: 'About page',
  services: 'Services page',
  contact: 'Contact page',
  shop: 'Shop page',
  faq: 'FAQ page',
  wholesale: 'Wholesale page',
  track_order: 'Track order page',
  privacy: 'Privacy policy',
  terms: 'Terms of service',
  shipping: 'Shipping policy',
  returns: 'Returns policy',
};

const PAGE_ORDER = [
  'global',
  'home',
  'about',
  'services',
  'shop',
  'contact',
  'wholesale',
  'faq',
  'blog',
  'track_order',
  'privacy',
  'terms',
  'shipping',
  'returns',
];

function pageLabel(key) {
  return PAGE_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminContent() {
  const [pages, setPages] = useState({});
  const [activePage, setActivePage] = useState('home');
  const [activeSection, setActiveSection] = useState('');
  const [visualData, setVisualData] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => adminApi.content().then((r) => setPages(r.pages || {}));

  useEffect(() => {
    load();
  }, []);

  const pageKeys = useMemo(() => {
    const keys = new Set([...PAGE_ORDER, ...Object.keys(pages), ...Object.keys(PAGE_LABELS)]);
    return [...keys].sort((a, b) => {
      const ai = PAGE_ORDER.indexOf(a);
      const bi = PAGE_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [pages]);

  const sections = useMemo(
    () => (pages[activePage]?.sections ? Object.keys(pages[activePage].sections) : []),
    [pages, activePage],
  );

  useEffect(() => {
    if (sections.length && !sections.includes(activeSection)) {
      setActiveSection(sections[0]);
    }
  }, [activePage, sections, activeSection]);

  useEffect(() => {
    if (!activePage || !activeSection) return;
    const data = pages[activePage]?.sections?.[activeSection]?.data ?? {};
    setVisualData(structuredClone(data));
  }, [activePage, activeSection, pages]);

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await adminApi.updateContent(activePage, activeSection, visualData);
      toast.success('Saved. Refresh the public site to see changes.');
      load();
    } catch (e) {
      toast.error(e.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const updatedAt = pages[activePage]?.sections?.[activeSection]?.updatedAt;

  return (
    <AdminPage
      title="Website content"
      description="Edit all site text and images: slider, footer, headers, home sections, legal pages, and more. Products and blog posts have their own admin pages."
    >
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <Card className="border-forest/15 bg-forest/[0.04] ring-foreground/[0.06]">
          <CardHeader>
            <CardTitle className="text-base">Pages</CardTitle>
            <CardDescription>Select a page to edit</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[min(70vh,520px)]">
              <div className="flex flex-col gap-1 p-3">
                {pageKeys.map((p) => (
                  <Button
                    key={p}
                    type="button"
                    variant={activePage === p ? 'default' : 'ghost'}
                    className="justify-start"
                    onClick={() => {
                      setActivePage(p);
                      setActiveSection('');
                    }}
                  >
                    {pageLabel(p)}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border-wheat/35 bg-wheat/10 ring-foreground/[0.06]">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base">{pageLabel(activePage)}</CardTitle>
                {updatedAt ? (
                  <CardDescription>Last saved {new Date(updatedAt).toLocaleString()}</CardDescription>
                ) : sections.length ? (
                  <CardDescription>{sections.length} editable section(s)</CardDescription>
                ) : (
                  <CardDescription>
                    No sections yet — restart the API to sync defaults, or save from another environment.
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <Button
                  key={s}
                  type="button"
                  size="sm"
                  variant={activeSection === s ? 'default' : 'outline'}
                  onClick={() => setActiveSection(s)}
                >
                  {sectionGroupLabel(s)}
                </Button>
              ))}
            </div>

            {activeSection ? (
              <div className="flex flex-col gap-4">
                <JsonContentEditor
                  data={visualData}
                  onChange={setVisualData}
                  onSave={save}
                  saving={saving}
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {sections.length
                  ? 'Select a section above.'
                  : 'This page has no content sections in the database yet.'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPage>
  );
}
