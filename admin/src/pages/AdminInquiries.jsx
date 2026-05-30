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
    <AdminPage title="Inquiries" description="Contact and wholesale messages from the website.">
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
