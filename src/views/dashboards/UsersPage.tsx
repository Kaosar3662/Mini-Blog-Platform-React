import React, { useEffect, useState } from 'react';
import { TextInput, Button, Select } from 'flowbite-react';
import { apiService, useUI } from '../../Api/Axios';
import Pagination from '../../components/frontend/Pagination';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'blogger';
  status: 'active' | 'inactive' | 'pending';
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: string;
}

const UsersPage: React.FC = () => {
  const { setLoader, setAlert } = useUI();

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const limit = 10;

  const fetchUsers = async () => {
    const offset = (currentPage - 1) * limit;

    const res: any = await apiService.request(
      'get',
      'admin/users',
      {},
      {
        params: {
          limit,
          offset,
          search: searchTerm,
          role: roleFilter || undefined,
          status: statusFilter || undefined,
        },
      },
      setLoader,
      setAlert,
      setErrors,
    );

    if (res?.data) {
      setUsers(res.data.data || []);
      setTotal(res.data.total || 0);
    }
  };

  const openEditModal = (user: User) => {
    setEditUser(user);
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editUser) return;

    const success = await apiService.request(
      'post',
      `admin/user/${editUser.email}`,
      editUser,
      {},
      setLoader,
      setAlert,
      setErrors,
    );

    if (success) {
      setModalOpen(false);
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-semibold">Users</h2>

        <div className="flex gap-3 flex-wrap">
          <TextInput
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          <Select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-auto min-w-[160px]"
          >
            <option value="">All Roles</option>
            <option value="moderator">Moderator</option>
            <option value="blogger">Blogger</option>
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-auto min-w-[160px]"
          >
            <option value="">All Status </option>
            <option value="active">Active </option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className=" hover:bg-gray-100">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 capitalize">{user.role}</td>
                  <td className="px-6 py-4 capitalize">{user.status}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button size="xs" onClick={() => openEditModal(user)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between w-full">
        <h6>Total: {total}</h6>

        {totalPages > 1 && (
          <div className="flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page: number) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>

      {modalOpen && editUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white flex flex-col rounded-2xl shadow-md px-6 py-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold mb-4">Edit User</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <TextInput
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              <TextInput
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}

              <Select
                value={editUser.role}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value as any })}
              >
                <option value="moderator">Moderator</option>
                <option value="blogger">Blogger</option>
              </Select>
              {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role}</p>}

              <Select
                value={editUser.status}
                onChange={(e) => setEditUser({ ...editUser, status: e.target.value as any })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </Select>
              {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status}</p>}

              <div className="flex justify-start gap-2">
                <Button onClick={handleUpdate}>Save</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
