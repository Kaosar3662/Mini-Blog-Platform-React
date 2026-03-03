import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { apiService, useUI } from 'src/Api/Axios';
import Comments from 'src/components/frontend/CommentSection';

interface Post {
  id: number;
  title: string;
  slug: string;
  short_desc: string;
  content: string;
  cover_image: string | null;
  created_at: string;
  comments?: any[];
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
  const location = useLocation();
  const from = (location.state as any)?.from || null;
  const { setLoader, setAlert } = useUI();
  const [post, setPost] = useState<Post | null>(null);
  const auth = JSON.parse(localStorage.getItem('auth') || '{}');
  let url = '';

  if (!from) {
    url = `/posts/${slug}`;
    console.log(from)
  } else if (from === 'admin') {
    url = `/admin/posts/${slug}`;
    console.log(from)
  } else if (from === 'blogger') {
    url = `/blogger/posts/${slug}`;
    console.log(from)
  } else {
    console.log(from)
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
    <div className="max-w-4xl mx-auto pt-30 pb-20 px-4 min-h-[calc(100vh-88px)] space-y-12">

      {/* Hero Section */}
      <section className="bg-white shadow-md rounded-2xl p-6">
        <div className="relative rounded-2xl overflow-hidden">
          {post.cover_image ? (
            <img
              src={`http://127.0.0.1:8000/storage/${post.cover_image}`}
              alt={post.title}
              className="w-full h-[360px] object-cover"
            />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1492724441997-5dc865305da7"
              alt="Post Cover"
              className="w-full h-[360px] object-cover"
            />
          )}

          <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {post.title}
            </h1>

            <div className="text-sm text-gray-200 flex flex-wrap gap-4">
              {post.category && <span>Category: {post.category.name}</span>}
              {post.user && <span>Author: {post.user.name}</span>}
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white shadow-md rounded-2xl p-8">
        <p className="text-gray-700 mb-8">{post.short_desc}</p>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </section>

      {/* Comments Section */}
      {post.comments && (
        <Comments comments={post.comments} slug={post.slug} />
      )}

      {/* CTA Section */}
      <section className="bg-white shadow-md rounded-2xl overflow-hidden">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
            alt="More Posts"
            className="w-full h-[280px] object-cover"
          />
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Explore More Posts
            </h2>
            <p className="text-gray-200 mb-6 max-w-xl">
              Discover more articles and insights from our blog.
            </p>
            <a
              href="/posts"
              className="inline-block bg-primary text-white px-6 py-3 rounded-xl"
            >
              View All Posts
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Postdetails;


