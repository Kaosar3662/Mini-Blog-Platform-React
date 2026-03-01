import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService, useUI } from 'src/Api/Axios';
import BlogCard from 'src/components/frontend/BlogCard';
import Pagination from 'src/components/frontend/Pagination';
import Search from 'src/components/frontend/Search';

interface Post {
  id: number;
  title: string;
  slug: string;
  cover_image?: string;
  category?: { id: number; name: string };
  user?: { id: number; name: string };
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const AllPosts = () => {
  const { setLoader, setAlert } = useUI();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchCategories = async () => {
    const res = await apiService.request('get', '/categories', {}, {}, setLoader, setAlert);
    if (res?.success) setCategories(res.data);
  };

  const fetchPosts = async () => {
    let url = '';
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    const slugParam = '';

  
      url = '/posts';
    

    const offset = (currentPage - 1) * limit;
    const res: any = await apiService.request(
      'get',
      url,
      {},
      { params: { limit, offset, search: searchTerm, category_id: selectedCategory } },
      setLoader,
      setAlert,
    );

    if (res?.success) {
      setPosts(res.data.data);
      setTotal(res.data.meta.total);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [searchTerm, selectedCategory, currentPage]);

  return (
    <div className="max-w-4xl mx-auto min-h-[calc(100vh-88px)] pt-30 pb-20 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <Search searchTerm={searchTerm} onSearch={setSearchTerm} />
        <select
          className="border border-gray-300 focus:outline-primary rounded-2xl px-3 py-2"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-5">
        {posts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-10">
            No blog found.
          </div>
        ) : (
          posts.map((post) => (
            <Link key={post.id} to={`/postdetails/${post.slug}`} className="hover:text-blue-600">
              <BlogCard post={post} />
            </Link>
          ))
        )}
      </div>

      <div className="flex items-center justify-between w-full">
        <h6>Total: {total}</h6>
        {total > 1 && (
          <Pagination currentPage={currentPage} totalPages={total} onPageChange={setCurrentPage} />
        )}
      </div>
    </div>
  );
};

export default AllPosts;