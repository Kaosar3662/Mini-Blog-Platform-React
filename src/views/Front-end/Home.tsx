import React, { useEffect, useState } from 'react';
import { apiService } from '../../Api/Axios';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import BlogCard from 'src/components/frontend/BlogCard';

interface Post {
  id: number;
  title: string;
  excerpt?: string;
  slug: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res: any = await apiService.request(
        'get',
        '/posts',
        {},
        { params: { limit: 9, offset: 0 } }
      );

      setPosts(res?.data?.data || []);
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-[calc(100vh-88px)] max-w-4xl px-4 mx-auto flex flex-col pt-23">
      
      {/* Hero Section */}
      <section className="bg-white shadow-md rounded-2xl p-6 mb-12">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1492724441997-5dc865305da7"
            alt="Blog Hero"
            className="w-full h-[420px] object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-5xl font-bold text-white mb-4">
              Welcome to Our Blog
            </h1>
            <p className="text-gray-200 text-lg max-w-2xl">
              Discover ideas, stories, and insights from our latest posts.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="bg-white shadow-md rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-8">Latest Posts</h2>

        {posts.length === 0 ? (
          <p className="text-gray-500">No posts available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} to={`/postdetails/${post.slug}`}>
                <BlogCard post={post} />
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link to="/posts">
            <Button color="primary">View All Posts</Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white shadow-md rounded-2xl overflow-hidden mb-12">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
            alt="Contact CTA"
            className="w-full h-[320px] object-cover"
          />
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Want to Get in Touch?
            </h2>
            <p className="text-gray-200 mb-6 max-w-xl">
              We would love to hear from you. Reach out through our contact page.
            </p>
            <Link to="/contact">
              <Button color="primary">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;