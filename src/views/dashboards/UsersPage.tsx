import { useEffect, useState } from 'react';
import { apiService, useUI } from '../../Api/Axios';
import { TextInput, Button } from 'flowbite-react';
import Search from '../../components/frontend/Search';
import Pagination from '../../components/frontend/Pagination';

interface User {
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'blogger';
  status: 'active' | 'inactive' | 'pending';
}

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: string;
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | null>(null);

  const [editUser, setEditUser] = useState<User | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'moderator' | 'blogger'>('moderator');
  const [status, setStatus] = useState<'active' | 'inactive' | 'pending'>('active');

  const [errors, setErrors] = useState<FormErrors>({});

  const { setAlert, setLoader } = useUI();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState<number>(0);
  const limit = 2;

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
    );

    const list = res?.data?.data || [];
    const totalItems = res?.data?.total || 0;

    setUsers(list);
    setTotal(totalItems);
    setTotalPages(Math.ceil(totalItems / limit));
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  const openCreateModal = () => {
    setName('');
    setEmail('');
    setPassword('');
    setModalType('create');
    setModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setStatus(user.status);
    setPassword('');
    setModalType('edit');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setEditUser(null);
    setErrors({});
  };

  const handleCreate = async () => {
    if (!name || !email || !password) return;

    const res: any = await apiService.request(
      'post',
      'admin/create-moderator',
      { name, email, password },
      {},
      setLoader,
      setAlert,
      setErrors,
    );

    if (res?.success) {
      setCurrentPage(1);
      fetchUsers();
      closeModal();
    }
  };

  const handleUpdate = async () => {
    if (!editUser) return;

    const payload: any = {
      name,
      email,
      role,
      status,
    };

    if (password.trim()) {
      payload.password = password;
    }

    const res: any = await apiService.request(
      'post',
      `admin/user/${editUser.email}`,
      payload,
      {},
      setLoader,
      setAlert,
      setErrors,
    );

    if (res?.success) {
      fetchUsers();
      closeModal();
    }
  };

  return (
    <div className="flex flex-col space-y-6 h-full">
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex gap-4 w-fit">
          <Search
            searchTerm={searchTerm}
            onSearch={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
          />

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className=" rounded-2xl px-3 py-2 bg-white shadow-md"
          >
            <option value="">All Roles</option>
            <option value="moderator">Moderator</option>
            <option value="blogger">Blogger</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className=" rounded-2xl px-3 py-2 bg-white shadow-md"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <Button onClick={openCreateModal} className="whitespace-normal">
          Create Moderator
        </Button>
      </div>

      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
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
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-lg bg-white">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={index} className="bg-white hover:bg-gray-100">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 capitalize">{user.role}</td>
                <td className="px-6 py-4 capitalize">{user.status}</td>
                <td className="px-6 py-4">
                  <Button size="xs" onClick={() => openEditModal(user)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between w-full">
        <h6>Total: {total}</h6>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div
            className="bg-white p-6 w-full max-w-md rounded-lg"
            style={{ borderRadius: 'var(--radius-lg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {modalType === 'create' ? 'Create Moderator' : 'Edit User'}
              </h3>
              <button onClick={closeModal} className="text-xl font-bold">
                &times;
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <TextInput
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <TextInput
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <TextInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

              {modalType === 'edit' && (
                <>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="border rounded-2xl pl-3 pr-5 py-2 border-gray-300 "
                  >
                    <option value="moderator">Moderator</option>
                    <option value="blogger">Blogger</option>
                  </select>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="border rounded-2xl pl-3 pr-5 py-2 border-gray-300 "
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </>
              )}

              <Button onClick={modalType === 'create' ? handleCreate : handleUpdate}>
                {modalType === 'create' ? 'Create' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
