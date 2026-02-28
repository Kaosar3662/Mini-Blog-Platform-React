

import React from 'react';
import { Link } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  slug: string;
  cover_image?: string;
  category?: {
    id: number;
    name: string;
  };
  user?: {
    id: number;
    name: string;
  };
}

interface BlogCardProps {
  post: Post;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {post.cover_image && (

          <img
            src={`http://127.0.0.1:8000/storage/${post.cover_image}`}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
      )}
      <div className="p-4">
        <div className="text-sm text-gray-500 flex justify-between flex-wrap items-center gap-2">
          {post.user && <span>Author: {post.user.name}</span>}
          {post.category && <span className='px-2 py-1 bg-gray-100 border border-gray-300 rounded-2xl'>{post.category.name}</span>}
        </div>
        <h2 className="text-xl font-bold mb-2">
            {post.title}
        </h2>
      </div>
    </div>
  );
};

export default BlogCard;