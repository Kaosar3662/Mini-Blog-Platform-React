import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService, useUI } from '../../Api/Axios';
import Pagination from '../../components/frontend/Pagination';
import SearchInput from '../../components/frontend/Search';
import { Button } from 'flowbite-react';
import { FaCheck, FaEyeSlash, FaTrash, FaTimes } from 'react-icons/fa';

interface Post {
  id: number;
  title: string;
}

interface Comment {
  id: number;
  comment_text: string;
  post_title: string;
  post_slug: string;
  parentPost: Post;
  status: string;
}

const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [limit, setLimit] = useState<number>(2);
  const [offset, setOffset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const { setLoader, setAlert } = useUI();

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const fetchComments = async () => {
    const res = await apiService.request(
      'get',
      'admin/comments',
      {},
      { params: { limit, offset, search: searchTerm } },
      setLoader,
      setAlert,
    );
    setComments(res.data.data);
    setTotal(res.data.total);
    console.log(res.data.data);
  };

  useEffect(() => {
    fetchComments();
  }, [limit, offset, searchTerm]);

  const handleApprove = async (id: number) => {
    await apiService.request('PUT', `admin/comments/${id}/approve`, {}, {}, setLoader, setAlert);
    fetchComments();
  };

  const handleHide = async (id: number) => {
    await apiService.request('PUT', `admin/comments/${id}/hide`, {}, {}, setLoader, setAlert);
    fetchComments();
  };

  const handleDelete = async (id: number) => {
    await apiService.request('DELETE', `admin/comments/${id}`, {}, {}, setLoader, setAlert);
    fetchComments();
  };

  const openModal = (comment: Comment) => {
    setSelectedComment(comment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedComment(null);
    setModalOpen(false);
  };

  const onPageChange = (page: number) => {
    setOffset((page - 1) * limit);
  };

  return (
    <div className="relative pt-10">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold mb-4">Admin Comments</h1>
        <SearchInput
          searchTerm={searchTerm}
          onSearch={(e) => {
            setSearchTerm(e);
          }}
        />
      </div>
      <div className="overflow-hidden rounded-lg mt-4">
        <table className="min-w-full  bg-white  shadow-md  ">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider "
              >
                Comment Text
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider "
              >
                Parent Post
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comments.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No comments found.
                </td>
              </tr>
            )}
            {comments.map((comment) => (
              <tr key={comment.id} className="hover:bg-gray-50">
                <td
                  className="px-6 py-4 whitespace-nowrap max-w-xs truncate cursor-pointer text-primary-600 hover:underline"
                  onClick={() => openModal(comment)}
                  title={comment.comment_text}
                >
                  {comment.comment_text}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/postdetails/${comment.post_slug}`}
                    className="text-primary-600 hover:underline"
                  >
                    {comment.post_title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={
                      comment.status === 'approved'
                        ? 'text-green-600 font-medium'
                        : comment.status === 'hidden'
                        ? 'text-yellow-600 font-medium'
                        : 'text-gray-600 font-medium'
                    }
                  >
                    {comment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  {comment.status !== 'approved' && (
                    <Button
                      size="xs"
                      color="success"
                      onClick={() => handleApprove(comment.id)}
                      className="inline-flex items-center px-3 py-1.5 text-xs"
                    >
                      Approve
                    </Button>
                  )}
                  <Button
                    size="xs"
                    color="warning"
                    onClick={() => handleHide(comment.id)}
                    className="inline-flex items-center px-3 py-1.5 text-xs"
                  >
                    Hide
                  </Button>
                  <Button
                    size="xs"
                    color="error"
                    onClick={() => handleDelete(comment.id)}
                    className="inline-flex items-center px-3 py-1.5 text-xs"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <h6 className="text-sm text-gray-700">Total: {total}</h6>
        {total > limit && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
      {modalOpen && selectedComment && (
        <div className="absolute inset-0 bg-[#EEF3F8] h-full flex justify-start items-start z-50">
          <div className="bg-white rounded-lg w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-semibold mb-4">Comment Details</h2>
            <p className="mb-4 whitespace-pre-wrap">{selectedComment.comment_text}</p>
            <div>
              <strong>Parent Post: </strong>
              <Link
                to={`/postdetails/${selectedComment.post_slug}`}
                className="text-primary-600 hover:underline"
                onClick={closeModal}
              >
                {selectedComment.post_title}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
