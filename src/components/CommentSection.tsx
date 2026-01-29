import { useEffect, useState } from "react";
import { commentService } from "../services/commentService";
import type { Comment } from "../services/commentService";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  ideaId: number;
  currentUserId: number | null;
  isAuthenticated: boolean;
}

export default function CommentSection({ 
  ideaId, 
  currentUserId, 
  isAuthenticated 
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await commentService.getCommentsByIdea(ideaId);
      setComments(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load comments");
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [ideaId]);

  const handleAddComment = async (content: string) => {
    try {
      const newComment = await commentService.createComment(ideaId, content);
      setComments([newComment, ...comments]);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to add comment");
      throw err;
    }
  };

  const handleEditComment = async (commentId: number, newContent: string) => {
    try {
      const updatedComment = await commentService.updateComment(commentId, newContent);
      setComments(comments.map(c => c.id === commentId ? updatedComment : c));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to edit comment");
      throw err;
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete comment");
      throw err;
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Comments ({comments.length})
      </h2>

      <div className="mb-6">
        <CommentForm 
          onSubmit={handleAddComment} 
          isAuthenticated={isAuthenticated}
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading comments...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadComments}
            className="mt-2 text-sm text-red-800 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}