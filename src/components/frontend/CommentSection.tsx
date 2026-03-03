import React, { useMemo, useState } from 'react';
import { apiService, useUI } from '../../Api/Axios';
import { Button } from 'flowbite-react';

interface User {
  id: number;
  name: string;
}

interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  parent_id: number | null;
  comment_text: string;
  status: string;
  created_at: string;
  user: User;
}

interface Props {
  comments: Comment[];
  slug: string;
}

const Comments: React.FC<Props> = ({ comments, slug }) => {
  const { setLoader, setAlert } = useUI();
  const [commentText, setCommentText] = useState<string>('');
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [activeReply, setActiveReply] = useState<number | null>(null);

  const isLoggedIn = !!localStorage.getItem('auth');

  const sortedComments = useMemo(() => {
    return [...comments].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [comments]);

  const parentComments = sortedComments.filter((c) => c.parent_id === null);

  const getRepliesFor = (parentId: number) => {
    return sortedComments.filter((c) => c.parent_id === parentId);
  };

  const renderReplies = (parentId: number, level = 1): React.ReactNode => {
    return getRepliesFor(parentId).map((reply) => (
      <div
        key={reply.id}
        className={`border-l pl-2 mt-4 space-y-3 ${level === 1 ? 'ml-0' : ''}`}
      >
        <div className="flex justify-between items-center">
          <span className="font-medium text-sm">{reply.user.name}</span>
          <span className="text-xs text-gray-400">
            {new Date(reply.created_at).toLocaleDateString()}
          </span>
        </div>

        <p className="text-gray-600 text-sm whitespace-pre-wrap">
          {reply.comment_text}
        </p>

        {isLoggedIn && (
          <button
            className="text-primary-600 text-sm hover:underline"
            onClick={() => setActiveReply(reply.id)}
          >
            Reply
          </button>
        )}

        {activeReply === reply.id && (
          <div className="space-y-3">
            <textarea 
              value={replyText[reply.id] || ''}
              onChange={(e) =>
                setReplyText((prev) => ({
                  ...prev,
                  [reply.id]: e.target.value,
                }))
              }
              placeholder="Write your reply..."
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={2}
            />
            <Button
              size="sm"
              className="rounded-xl"
              onClick={() => handleReplySubmit(reply.id)}
            >
              Submit Reply
            </Button>
          </div>
        )}

        {renderReplies(reply.id, level + 1)}
      </div>
    ));
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    await apiService.request(
      'post',
      `blogger/posts/${slug}/comments`,
      { comment_text: commentText },
      {},
      setLoader,
      setAlert,
      undefined,
      true
    );

    setCommentText('');
  };

  const handleReplySubmit = async (commentId: number) => {
    const text = replyText[commentId];
    if (!text?.trim()) return;

    await apiService.request(
      'post',
      `blogger/posts/${slug}/comments/${commentId}/reply`,
      { comment_text: text },
      {},
      setLoader,
      setAlert,
    );

    setReplyText((prev) => ({ ...prev, [commentId]: '' }));
    setActiveReply(null);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-8 space-y-8">
      <h2 className="text-2xl font-semibold">Comments</h2>

      {/* Add Comment */}
      <div className="space-y-4">
        {isLoggedIn ? (
          <>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment..."
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
            />
            <Button className="rounded-xl" onClick={handleCommentSubmit}>
              Submit Comment
            </Button>
          </>
        ) : (
          <p className="text-sm text-gray-500">Please login to comment.</p>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {parentComments.length === 0 && <p className="text-gray-500 text-sm">No comments yet.</p>}

        {parentComments.map((comment) => {

          return (
            <div key={comment.id} className="border rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{comment.user.name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>

              <p className="text-gray-700 whitespace-pre-wrap">{comment.comment_text}</p>

              {isLoggedIn && (
                <button
                  className="text-primary-600 text-sm hover:underline"
                  onClick={() => setActiveReply(comment.id)}
                >
                  Reply
                </button>
              )}

              {/* Reply Form */}
              {activeReply === comment.id && (
                <div className="space-y-3">
                  <textarea
                    value={replyText[comment.id] || ''}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [comment.id]: e.target.value,
                      }))
                    }
                    placeholder="Write your reply..."
                    className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={2}
                  />
                  <Button
                    size="sm"
                    className="rounded-xl"
                    onClick={() => handleReplySubmit(comment.id)}
                  >
                    Submit Reply
                  </Button>
                </div>
              )}

              {renderReplies(comment.id, 1)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comments;
