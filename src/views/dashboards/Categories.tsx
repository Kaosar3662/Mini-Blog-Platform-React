import { useEffect, useState } from 'react';
import { apiService, useUI } from '../../Api/Axios';
import { TextInput, Button } from 'flowbite-react';
import Search from '../../components/frontend/Search';
import Pagination from '../../components/frontend/Pagination';

interface Category {
  id: number;
  name: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | null>(null);
  type FormErrors = {
    name?: string;
  };

  const [errors, setErrors] = useState<FormErrors>({});

  const { setAlert, setLoader } = useUI();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState<number>(0);
  const limit = 10;

  const fetchCategories = async () => {
    setLoader(true);
    const offset = (currentPage - 1) * limit;

    setAlert(null);
    const res: any = await apiService.request(
      'get',
      'admin/categories',
      {},
      {
        params: { limit, offset, search: searchTerm },
      },
      setLoader,
      setAlert,

    );

    setLoader(false);

    const list = Array.isArray(res?.data) ? res.data : res?.data?.data || [];

    setCategories(list);

    const totalItems = typeof res.data.total === 'number' ? res.data.total : list.length;
    setTotal(totalItems);
    setTotalPages(Math.ceil(totalItems / limit));
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm]);

  const openCreateModal = () => {
    setName('');
    setModalType('create');
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setModalType('edit');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setEditId(null);
    setEditName('');
    setName('');
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setErrors({});
    setAlert(null);
    const res: any = await apiService.request(
      'post',
      'admin/categories',
      { name },
      {},
      setLoader,
      setAlert,
      setErrors,
    );

    if (res && res.success) {
      setCurrentPage(1);
      fetchCategories();
      closeModal();
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    setErrors({});
    setAlert(null);
    const res: any = await apiService.request(
      'put',
      `admin/categories/${id}`,
      { name: editName },
      {},
      setLoader,
      setAlert,
      setErrors,
    );

    if (res && res.success) {
      fetchCategories();
      closeModal();
    }
  };

  const handleDelete = async (id: number) => {
        setAlert(null);
    const res: any = await apiService.request(
      'delete',
      `admin/categories/${id}`,
      {},
      {},
      setLoader,
      setAlert,
    );

    if (res && res.success) fetchCategories();
  };

  return (
    <div className="flex flex-col space-y-6 h-full">
      <div className="flex items-center justify-between gap-4 w-full">
        <Search
          searchTerm={searchTerm}
          onSearch={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
        />
        <Button onClick={openCreateModal}>Create a New Category</Button>
      </div>

      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Category Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        {categories.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={2} className="px-6 py-8 text-center text-gray-500 text-lg bg-white">
                No categories found.
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="bg-white hover:bg-gray-100">
                <td className="px-6 py-4">{cat.name}</td>
                <td className="flex gap-2 px-6 py-4">
                  <Button size="xs" onClick={() => openEditModal(cat)}>
                    Edit
                  </Button>
                  <Button size="xs" color="error" onClick={() => handleDelete(cat.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
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
                {modalType === 'create' ? 'Create' : 'Edit'}
              </h3>
              <button onClick={closeModal} className="text-xl font-bold">
                &times;
              </button>
            </div>

            {modalType === 'create' && (
              <>
                <div className="flex flex-col mb-4">
                  <TextInput
                    placeholder="Category name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-1"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <Button onClick={handleCreate}>Create</Button>
              </>
            )}

            {modalType === 'edit' && editId !== null && (
              <>
                <div className="flex flex-col mb-4">
                  <TextInput
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mb-1"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <Button onClick={() => handleUpdate(editId)}>Save</Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
