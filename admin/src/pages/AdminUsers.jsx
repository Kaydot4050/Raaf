import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx';
import AdminPage from '../components/AdminPage.jsx';
import AdminSection from '../components/AdminSection.jsx';
import { adminApi } from '../lib/api.js';
import { adminRowSurface } from '../lib/adminColors.js';
import { cn } from '@/lib/utils';

function userInitial(name, email) {
  const source = (name || email || '?').trim();
  return source.charAt(0).toUpperCase();
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const load = () => adminApi.users().then((r) => setUsers(r.users || []));

  useEffect(() => {
    load();
  }, []);

  const setRole = async (id, role) => {
    try {
      await adminApi.setUserRole(id, role);
      toast.success('Role updated.');
      load();
    } catch (err) {
      toast.error(err.message || 'Update failed.');
    }
  };

  return (
    <AdminPage
      title="Users"
      description="Manage customer accounts and admin access."
    >
      <AdminSection
        tone="cream"
        title="Registered users"
        description={
          <>
            Set <code className="text-xs">ADMIN_EMAIL</code> in API .env before first signup, or
            promote users here.
          </>
        }
      >
        <div className="flex flex-col gap-2.5">
          {users.map((u, i) => (
            <div key={u.id} className={cn('admin-row', adminRowSurface(i))}>
              <div className="admin-row-icon text-sm font-semibold">
                {userInitial(u.name, u.email)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{u.name || 'Unnamed user'}</p>
                <p className="text-sm text-muted-foreground">{u.email}</p>
              </div>
              <Select value={u.role || 'user'} onValueChange={(role) => setRole(u.id, role)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">user</SelectItem>
                  <SelectItem value="admin">admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
          {!users.length ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No users yet.</p>
          ) : null}
        </div>
      </AdminSection>
    </AdminPage>
  );
}
