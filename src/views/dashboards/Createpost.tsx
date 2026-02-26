import React, { useState, useEffect } from 'react';
import { Button, TextInput, Textarea, Label } from 'flowbite-react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService, useUI } from '../../Api/Axios';
import { HiTrash } from 'react-icons/hi';

interface Errors {
  title?: string;
  short_desc?: string;
  content?: string;
  category_id?: string;
  cover_image?: string;
  general?: string;
}

const CreateBlog: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { setLoader, setAlert } = useUI();

  const [formData, setFormData] = useState({
    title: '',
    short_desc: '',
    content: '',
    category_id: '',
    cover_image: null as File | null,
  });

  const [categories, setCategories] = useState<any[]>([]);

  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const fetchCategories = async () => {
      setAlert(null);
      const response = await apiService.request(
        'get',
        'categories',
        {},
        {},
        setLoader,
        setAlert,
        () => {},
      );

      if (response?.success) {
        setCategories(response.data);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      setErrors({});
      setAlert(null);
      const response = await apiService.request(
        'get',
        `blogger/posts/${slug}`,
        {},
        {},
        setLoader,
        setAlert,
        setErrors,
      );

      if (response?.success) {
        const post = response.data;
        setFormData((prev) => ({
          ...prev,
          title: post.title,
          short_desc: post.short_desc,
          content: post.content,
          category_id: String(post.category_id),
        }));
      }
    };

    fetchPost();
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        cover_image: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('short_desc', formData.short_desc);
    data.append('content', formData.content);
    data.append('category_id', formData.category_id);
    if (formData.cover_image) {
      data.append('cover_image', formData.cover_image);
    }
    setErrors({});
    setAlert(null);
    const response = await apiService.request(
      slug ? 'put' : 'post',
      slug ? `blogger/posts/${slug}` : 'blogger/posts',
      data,
      {},
      setLoader,
      setAlert,
      setErrors,
    );

    if (response?.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative overflow-hidden pt-10 flex justify-center items-start">
      <div className="w-full bg-white dark:bg-darkgray rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">{slug ? 'Edit Blog' : 'Create Blog'}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <Label htmlFor="title">Title</Label>
            <TextInput
              id="title"
              type="text"
              placeholder="Enter blog title"
              value={formData.title}
              onChange={handleChange}
              color={errors.title ? 'failure' : undefined}
              required
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          <div>
            <Label htmlFor="short_desc">Short Description</Label>
            <Textarea
              id="short_desc"
              placeholder="Quick summary of your blog"
              value={formData.short_desc}
              onChange={handleChange}
              rows={3}
            />
            {errors.short_desc && <p className="mt-1 text-xs text-red-600">{errors.short_desc}</p>}
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Full content of the blog post..."
              value={formData.content}
              onChange={handleChange}
              rows={6}
            />
            {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content}</p>}
          </div>

          <div>
            <Label htmlFor="category_id">Category</Label>
            <select
              id="category_id"
              value={formData.category_id}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category_id: e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-gray-300 bg-gray-100 p-3 focus:border-primary focus:ring-primary"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="mt-1 text-xs text-red-600">{errors.category_id}</p>
            )}
          </div>

          <div className='relative'>
            <Label htmlFor="cover_image">Cover Image</Label>
            {formData.cover_image && (
              <Button
                type="button"
                color="failure"
                className="absolute top-4 right-6 flex items-center gap-2"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    cover_image: null,
                  }))
                }
              >
                <HiTrash className="w-4 h-4" />
                Remove Image
              </Button>
            )}
            <input
              id="cover_image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 cursor-pointer
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-xl file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-white
                        file:cursor-pointer
                        hover:file:opacity-90"
            />
            {formData.cover_image && (
              <div className=" relative mt-4 flex flex-col items-start gap-3">
                <img
                  src={URL.createObjectURL(formData.cover_image)}
                  alt="Preview"
                  className="w-full max-w-60 rounded-xl shadow-md object-cover"
                />
              </div>
            )}
            {errors.cover_image && (
              <p className="mt-1 text-xs text-red-600">{errors.cover_image}</p>
            )}
          </div>

          <Button type="submit" className="w-full mt-4 shadow-md">
            {slug ? 'Update Blog' : 'Publish Blog'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
