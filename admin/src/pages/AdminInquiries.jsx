import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge.jsx';
import AdminPage from '../components/AdminPage.jsx';
import AdminSection from '../components/AdminSection.jsx';
import { adminApi } from '../lib/api.js';
import { adminRowSurface } from '../lib/adminColors.js';
import { cn } from '@/lib/utils';

export default function AdminInquiries() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    adminApi.inquiries().then((r) => setItems(r.inquiries || []));
  }, []);

  return (
    <AdminPage title="Inquiries" description="Contact, wholesale, and service booking messages from the website.">
      <AdminSection
        tone="gold"
        title="Messages"
        description={`${items.length} inquir${items.length === 1 ? 'y' : 'ies'}`}
      >
        <div className="flex flex-col gap-2.5">
          {items.map((q, i) => (
            <div key={q.id} className={cn('admin-row items-start', adminRowSurface(i))}>
              <div className="admin-row-icon">
                <Mail className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{q.name}</p>
                  <Badge variant="secondary">{q.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {q.email} · {q.phone} · {new Date(q.created_at).toLocaleString()}
                </p>
                <p className="mt-2 text-sm leading-relaxed">{q.message}</p>
                {q.metadata && typeof q.metadata === 'object' && Object.keys(q.metadata).length > 0 ? (
                  <dl className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                    {Object.entries(q.metadata).map(([k, v]) => (
                      v ? (
                        <div key={k}>
                          <dt className="inline font-medium capitalize after:content-[':_']">{k.replace(/([A-Z])/g, ' $1')}</dt>
                          <dd className="inline">{String(v)}</dd>
                        </div>
                      ) : null
                    ))}
                  </dl>
                ) : null}
              </div>
            </div>
          ))}
          {!items.length ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No inquiries yet.</p>
          ) : null}
        </div>
      </AdminSection>
    </AdminPage>
  );
}
