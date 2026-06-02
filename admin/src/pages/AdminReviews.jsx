import { useEffect, useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge.jsx';
import AdminPage from '../components/AdminPage.jsx';
import AdminSection from '../components/AdminSection.jsx';
import { adminApi } from '../lib/api.js';
import { adminRowSurface } from '../lib/adminColors.js';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button.jsx';

export default function AdminReviews() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    adminApi.reviews().then((r) => setItems(r.reviews || []));
  };

  const updateStatus = async (id, status) => {
    try {
      await adminApi.updateReviewStatus(id, status);
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminPage title="Product Reviews" description="Manage customer reviews before they appear on the site.">
      <AdminSection
        tone="emerald"
        title="All Reviews"
        description={`${items.length} review${items.length === 1 ? '' : 's'}`}
      >
        <div className="flex flex-col gap-2.5">
          {items.map((review, i) => (
            <div key={review.id} className={cn('admin-row items-start', adminRowSurface(i))}>
              <div className="admin-row-icon">
                <MessageSquare className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-medium">{review.user_name}</p>
                  <span className="text-sm text-muted-foreground">on {review.product_id}</span>
                  {review.status === 'pending' && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>}
                  {review.status === 'approved' && <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>}
                  {review.status === 'rejected' && <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>}
                </div>
                <div className="flex items-center gap-1 mb-2 text-[#f5b041]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className={`w-3.5 h-3.5 ${idx < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="mt-1 text-sm leading-relaxed">{review.comment}</p>
                
                <div className="mt-3 flex items-center gap-2">
                  {review.status !== 'approved' && (
                    <Button size="sm" onClick={() => updateStatus(review.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white">Approve</Button>
                  )}
                  {review.status !== 'rejected' && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(review.id, 'rejected')} className="text-red-600 border-red-200 hover:bg-red-50">Reject</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {!items.length ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No reviews yet.</p>
          ) : null}
        </div>
      </AdminSection>
    </AdminPage>
  );
}