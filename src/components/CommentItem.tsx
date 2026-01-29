import { useState } from "react";
import type { Comment } from "../services/commentService";

interface CommentItemProps {
  comment: Comment;
  currentUserId: number | null;
  onEdit: (commentId: number, newContent: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
}

export default function CommentItem({ 
  comment, 
  currentUserId, 
  onEdit, 
  onDelete 
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = currentUserId === comment.userId;

  const handleEdit = async () => {
    if (!editContent.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      await onEdit(comment.id, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to edit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setIsSubmitting(true);
      try {
        await onDelete(comment.id);
      } catch (error) {
        console.error("Failed to delete comment:", error);
        setIsSubmitting(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900">
              {comment.user.username}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {comment.authorRole === "investor" ? "Investor" : "Idea Generator"}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(comment.createdAt)}
            </span>
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                disabled={isSubmitting}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleEdit}
                  disabled={isSubmitting}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  disabled={isSubmitting}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:bg-gray-200 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          )}
        </div>

        {isOwner && !isEditing && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isSubmitting}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="text-sm text-red-600 hover:text-red-800 disabled:text-gray-400"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}