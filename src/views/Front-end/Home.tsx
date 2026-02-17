import React, { useState, useEffect } from 'react';
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import HeroSection from "../../components/HeroSection";
// import SearchBar from "../../components/SearchBar";
// import CategoryFilter from "../../components/CategoryFilter";
// import BlogList from "../../components/BlogList";
// import BlogCard from "../../components/BlogCard";
import Pagination from '../../components/frontend/pagination';
import{apiService} from '../../Api/Axios';
import { Link } from "react-router";
import { Button } from "flowbite-react";

const Home: React.FC = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ContentPerPage = 10;

  useEffect(() => {
    let canceled = false;
    const fetchPosts = async () => {
      try {
        const offset = (currentPage - 1) * ContentPerPage;
        //  const data = await apiService({ search: searchTerm });
        //  if (canceled) return;
        //  const allPosts = data.data.posts || [];
        //  const start = (currentPage - 1) * ContentPerPage;
        //  const end = start + ContentPerPage;
        //  setPosts(allPosts.slice(start, end));
        // setTotalPages(Math.ceil(allPosts.length / ContentPerPage) || 1);
        const allPosts = 500
        setTotalPages(Math.ceil(allPosts/ContentPerPage) || 10);
      } catch (error) {
        if (!canceled) setPosts([]);
      }
    };
    fetchPosts();
    return () => {
      canceled = true;
    };
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Dummy data for BlogList
  const dummyBlogs = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Blog Post ${i + 1}`,
    excerpt: 'This is a short summary of the blog post.',
    status: 'Published',
  }));

  return (
    <div className="min-h-screen flex flex-col">
      {/*   <Navbar /> */}

      <main className="flex-1 container mx-auto px-4 py-6">
        {/*   <HeroSection /> 

   <div className="my-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <SearchBar />
   <CategoryFilter />
  </div>

   <BlogList>
   {dummyBlogs.map((blog) => (
<BlogCard key={blog.id} title={blog.title} excerpt={blog.excerpt} status={blog.status} />
   ))}
      </BlogList>
      */}
        <Link to={'/auth/login'}>
          <Button>Login</Button>
        </Link>
        <h1 className="text-primary text-[70px] my-10">This is Home</h1>

        <div className="mt-6 ">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      {/*  <Footer /> */}
    </div>
  );
};

export default Home;
