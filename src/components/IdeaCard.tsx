import React, { useState } from "react";
import { Clock, MessageCircle } from "lucide-react";
import API from "../services/api";

interface CommentData {
  id: number;
  ideaId: number;
  content: string;
  authorRole: "investor" | "owner";
  createdAt?: string;
}

interface IdeaProps {
  id: number;
  title: string;
  description: string;
  author?: {
    username?: string;
    email?: string;
  };
  interestCount?: number; // total number of interests
  interestStatus?: "pending" | "accepted" | "rejected" | null; // current user's status
  onExpress?: (id: number) => void;

  // new props for comments
  comments?: CommentData[];
  onCommentAdded?: () => void; // parent (IdeasPage) can refetch ideas
}

export default function IdeaCard({
  id,
  title,
  description,
  author,
  interestCount = 0,
  interestStatus,
  onExpress,
  comments = [],
  onCommentAdded,
}: IdeaProps) {
  return (
    <div className="bg-white border rounded-xl shadow-md p-4 hover:shadow-lg transition flex flex-col gap-3">
      {/* Header */}
      <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mt-1 text-sm line-clamp-3">{description}</p>

      {/* Author + interest */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
        <p>
          By: {author?.username || author?.email || "Anonymous"}
        </p>
        <p className="text-purple-600 text-sm">
          {interestCount}{" "}
          {interestCount === 1 ? "person is" : "people are"} interested
        </p>
      </div>

      {/* Express interest button */}
      {onExpress && (
        <button
          onClick={() => onExpress(id)}
          disabled={!!interestStatus} // disable if already expressed
          className={`mt-2 text-sm px-4 py-2 rounded-lg text-white ${
            interestStatus
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {interestStatus ? "Pending" : "Express Interest"}
        </button>
      )}

      {/* Comments section */}
      <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-gray-700" />
          <h4 className="text-sm font-semibold text-gray-800">Comments</h4>
        </div>

        {/* Existing comments */}
        {comments.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="text-xs bg-gray-50 rounded-lg px-3 py-2"
              >
                <div className="flex justify-between">
                  <span className="font-medium text-gray-800">
                    {comment.authorRole === "investor" ? "Investor" : "Owner"}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Clock className="w-3 h-3" />
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleString()
                      : ""}
                  </span>
                </div>
                <p className="text-gray-700 mt-1">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No comments yet.</p>
        )}

        {/* Add comment form (investor) */}
        {onCommentAdded && (
          <InvestorCommentForm ideaId={id} onCommentAdded={onCommentAdded} />
        )}
      </div>
    </div>
  );
}

function InvestorCommentForm({
  ideaId,
  onCommentAdded,
}: {
  ideaId: number;
  onCommentAdded: () => void;
}) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      await API.post(`/idea/${ideaId}/comments`, { content });
      setContent("");
      onCommentAdded();
    } catch (err: any) {
      console.error("Failed to add comment", err);
      alert(err.response?.data?.error || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-1">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Comment on this idea..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        type="submit"
        disabled={submitting || !content.trim()}
        className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Posting..." : "Send"}
      </button>
    </form>
  );
}
