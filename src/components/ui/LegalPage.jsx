import { Link } from 'react-router-dom';
import { SectionHeader } from './SectionReveal.jsx';

export default function LegalPage({ eyebrow, title, description, sections }) {
  return (
    <div className="py-12 sm:py-16 md:py-20 min-h-[50vh] bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} align="left" className="!mb-10" />
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h3 className="font-display text-lg font-bold text-charcoal mb-3">{section.title}</h3>
              {section.body && (
                <p className="text-text text-sm leading-relaxed">{section.body}</p>
              )}
              {section.list && (
                <ul className="mt-3 space-y-2 text-sm text-text leading-relaxed list-disc pl-5">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <p className="text-xs text-text-muted pt-4 border-t border-border">
            Last updated: May 2026 · Questions?{' '}
            <Link to="/contact" className="text-forest font-semibold hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
