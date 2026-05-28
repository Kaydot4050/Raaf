import { useEffect, useState } from 'react';
import { adminApi } from '../lib/api.js';

const PAGE_LABELS = {
  global: 'Global (footer & header)',
  home: 'Home',
  about: 'About',
  contact: 'Contact',
  shop: 'Shop',
  faq: 'FAQ',
  wholesale: 'Wholesale',
};

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/30';

export default function AdminContent() {
  const [pages, setPages] = useState({});
  const [activePage, setActivePage] = useState('home');
  const [activeSection, setActiveSection] = useState('');
  const [draft, setDraft] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const load = () => {
    adminApi.content().then((r) => setPages(r.pages || {}));
  };

  useEffect(() => {
    load();
  }, []);

  const sections = pages[activePage]?.sections ? Object.keys(pages[activePage].sections) : [];

  useEffect(() => {
    if (sections.length && !activeSection) setActiveSection(sections[0]);
  }, [activePage, sections, activeSection]);

  useEffect(() => {
    if (!activePage || !activeSection) return;
    const data = pages[activePage]?.sections?.[activeSection]?.data;
    setDraft(JSON.stringify(data ?? {}, null, 2));
  }, [activePage, activeSection, pages]);

  const save = async () => {
    setErr('');
    setMsg('');
    try {
      const data = JSON.parse(draft);
      await adminApi.updateContent(activePage, activeSection, data);
      setMsg('Saved. Refresh the public website to see changes.');
      load();
    } catch (e) {
      setErr(e.message || 'Invalid JSON or save failed.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">Page content</h1>
        <p className="text-sm text-text-muted mt-1">
          Edit text and image URLs for each section. Use paths like <code className="text-charcoal">/images/photo.png</code>.
        </p>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-4">
        <div className="bg-white rounded-2xl border border-border p-3 space-y-1 h-fit">
          {Object.keys(PAGE_LABELS).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setActivePage(p);
                setActiveSection('');
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activePage === p ? 'bg-forest text-white' : 'hover:bg-beige-soft text-charcoal'
              }`}
            >
              {PAGE_LABELS[p] || p}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setActiveSection(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  activeSection === s
                    ? 'bg-forest text-white border-forest'
                    : 'border-border text-charcoal hover:bg-beige-soft'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {activeSection ? (
            <>
              <label className="block text-xs font-semibold uppercase text-text-muted">Section JSON</label>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={18}
                className={`${inputCls} font-mono text-xs`}
              />
              {msg && <p className="text-sm text-forest">{msg}</p>}
              {err && <p className="text-sm text-red-700">{err}</p>}
              <button
                type="button"
                onClick={save}
                className="px-5 py-2.5 rounded-full bg-forest text-white text-sm font-semibold hover:bg-forest-light"
              >
                Save section
              </button>
            </>
          ) : (
            <p className="text-sm text-text-muted">Select a page with content sections.</p>
          )}
        </div>
      </div>
    </div>
  );
}
