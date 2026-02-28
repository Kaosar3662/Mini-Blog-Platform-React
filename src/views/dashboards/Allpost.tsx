import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Select} from 'flowbite-react';
import Pagination from '../../components/frontend/Pagination';
import Search from '../../components/frontend/Search';
import { apiService, useUI } from 'src/Api/Axios';

interface Post {
  slug: string;
  title: string;
  cover_image: string;
  status: string;
  category: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
}

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const limit = 2;

const Allpost: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const { setLoader, setAlert } = useUI();

  useEffect(() => {
    fetchPosts();
  }, [page, search, status]);

  const fetchPosts = async () => {
    const offset = (page - 1) * limit;

    const res: any = await apiService.request(
      'get',
      '/admin/posts',
      {},
      { params: { limit, offset, search, status } },
      setLoader,
      setAlert,
    );
    setPosts(res.data.data);
    setTotal(res.data.meta.total)
  };

  const handleApprove = async (slug: string) => {
      await apiService.request(
        'put',
        `/admin/posts/${slug}/approve`,
        {},
        {},
        setLoader,
        setAlert,
      );
      fetchPosts();

  };

  const handleReject = async (slug: string) => {
      await apiService.request(
        'put',
        `/admin/posts/${slug}/reject`,
        {},
        {},
        setLoader,
        setAlert,
      );
      fetchPosts();

  };

  const handleView = (slug: string) => {
    navigate(`/Postdetails/${slug}`);
  };

  const onPageChange = (p: number) => setPage(p);
   const totalPages = Math.ceil(total / limit);

  return (
    <div className="pt-10">
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex gap-2">
          <Search
            searchTerm={search}
            onSearch={(value) => {
              setSearch(value);
            }}
          />
          <Select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="w-40"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="overflow-hidden bg-white rounded-2xl shadow my-5">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border-b border-gray-200">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border-b border-gray-200">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border-b border-gray-200">
                User Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border-b border-gray-200">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border-b border-gray-200">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border-b border-gray-200">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  No posts found.
                </td>
              </tr>
            )}
            {posts.map((post) => (
              <tr key={post.slug} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {post.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {post.category?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {post.user?.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {post.cover_image ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${post.cover_image}`}
                      alt={post.title}
                      className="max-w-16 max-h-8 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={
                      post.status === 'approved'
                        ? 'text-green-600 font-semibold'
                        : post.status === 'rejected'
                          ? 'text-red-600 font-semibold'
                          : 'text-yellow-600 font-semibold'
                    }
                  >
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    {post.status === 'pending' && (
                      <>
                        <Button color="primary" size="xs" onClick={() => handleApprove(post.slug)}>
                          Approve
                        </Button>
                        <Button color="error" size="xs" onClick={() => handleReject(post.slug)}>
                          Reject
                        </Button>
                      </>
                    )}
                    <Button color="info" size="xs" onClick={() => handleView(post.slug)}>
                      Preview
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between w-full">
        <h6>Total: {total}</h6>
        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
        )}
      </div>
    </div>
  );
};

export default Allpost;
