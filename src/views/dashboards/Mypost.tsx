import React, { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router';
import { apiService, useUI } from '../../Api/Axios';
import Pagination from '../../components/frontend/Pagination';
import Search from '../../components/frontend/Search';

interface Post {
  title: string;
  slug: string;
  cover_image: string;
  status: string;
  category: {
    name: string;
  };
}

interface Meta {
  total: number;
}

const Mypost: React.FC = () => {
  const navigate = useNavigate();
  const { setLoader, setAlert } = useUI();

  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 10;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const fetchPosts = async (page = 1, search = '', status = '') => {
    const offset = (page - 1) * limit;

    setAlert(null);
    const res: any = await apiService.request(
      'get',
      'blogger/posts',
      {},
      { params: { limit, offset, search, status } },
      setLoader,
      setAlert,
    );

    if (res?.data) {
      setPosts(res.data.data);
      setMeta({ total: res.data.meta.total });
    }
  };

  useEffect(() => {
    fetchPosts(currentPage, debouncedSearchTerm, statusFilter);
  }, [currentPage, debouncedSearchTerm, statusFilter]);

  const handleDelete = async (slug: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    setAlert(null);
    const res: any = await apiService.request(
      'delete',
      `blogger/posts/${slug}`,
      {},
      {},
      setLoader,
      setAlert,
    );

    if (res?.success) {
      fetchPosts(currentPage, debouncedSearchTerm, statusFilter);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(meta.total / limit);

  return (
    <div className="flex flex-col space-y-6 p-6 h-full">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h2 className="text-2xl font-semibold">My Blogs</h2>
        <Search
          searchTerm={searchTerm}
          onSearch={(value) => {
            setSearchTerm(value);
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
          }}
          className="rounded-2xl px-3 py-2 bg-white shadow-md"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-md bg-white">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-lg">
                  No posts found.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.slug} className="bg-white hover:bg-gray-100">
                  <td className="px-6 py-4">{post.title}</td>
                  <td className="px-6 py-4">
                    <img
                      src={'http://127.0.0.1:8000/storage/' + post.cover_image}
                      alt={post.title}
                      className="w-full max-w-16 max-h-8 rounded-md object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 capitalize">{post.category.name}</td>
                  <td className="px-6 py-4 capitalize">{post.status}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/newpost/${post.slug}`)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Edit
                    </Button>
                    <Button size="sm" color="red" onClick={() => handleDelete(post.slug)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between w-full">
        <h6>Total: {meta.total}</h6>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Mypost;
