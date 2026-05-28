import { useEffect, useState } from 'react';
import { adminApi } from '../lib/api.js';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const load = () => adminApi.users().then((r) => setUsers(r.users || []));

  useEffect(() => {
    load();
  }, []);

  const setRole = async (id, role) => {
    await adminApi.setUserRole(id, role);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-charcoal">Users</h1>
      <p className="text-sm text-text-muted">
        First registered user becomes admin. Or set <code>ADMIN_EMAIL</code> in API .env before signup.
      </p>
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-beige-soft/50 text-left text-xs uppercase text-text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role || 'user'}
                    onChange={(e) => setRole(u.id, e.target.value)}
                    className="px-2 py-1 rounded-lg border border-border"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
