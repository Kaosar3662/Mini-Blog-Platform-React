import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiService, useUI } from 'src/Api/Axios';

interface Post {
  id: number;
  title: string;
  slug: string;
  short_desc: string;
  content: string;
  cover_image: string | null;
  created_at: string;
  category?: {
    id: number;
    name: string;
  };
  user?: {
    id: number;
    name: string;
  };
}

const Postdetails = () => {
  const { slug } = useParams();
  const { setLoader, setAlert } = useUI();
  const [post, setPost] = useState<Post | null>(null);
  const auth = JSON.parse(localStorage.getItem('auth') || '{}');
  let url = '';

  if (auth.role === 'admin' || auth.role === 'moderator') {
    url = `/admin/posts/${slug}`;
  } else if (auth.role === 'blogger') {
    url = `/blogger/posts/${slug}`;
  } else {
    url = `/posts/${slug}`;
  }

  const fetchPost = async () => {
    if (!slug) return;

    setAlert(null);

    const res = await apiService.request('get', url, {}, {}, setLoader, setAlert);

    if (res?.success) {
      setPost(res.data);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-6 text-center">
        <p className="text-gray-500">Loading post...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-24 px-4 min-h-[calc(100vh-88px)]">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {post.cover_image && (
        <img
          src={`http://127.0.0.1:8000/storage/${post.cover_image}`}
          alt={post.title}
          className="w-full h-100 object-cover rounded-2xl mb-8"
        />
      )}

      <div className="text-sm text-gray-500 mb-6 flex gap-4">
        {post.category && <span>Category: {post.category.name}</span>}
        {post.user && <span>Author: {post.user.name}</span>}
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>

      <p className="text-gray-700 mb-8">{post.short_desc}</p>

      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};

export default Postdetails;
