import { useEffect, useState } from "react";
import {
  PlusCircle,
  LogOut,
  Grid,
  MessageSquare,
} from "lucide-react";
import API from "../services/api";

interface Comment {
  id: number;
  content: string;
  userId: number;
  authorRole: "investor" | "idea-generator";
  createdAt: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

interface Idea {
  id: number;
  title: string;
  description: string;
  problemSolved?: string;
  solutionProposed?: string;
  status: string;
  comments?: Comment[];
  createdAt?: string;
  interestCount?: number;
}

interface FormData {
  title: string;
  description: string;
  problemSolved: string;
  solutionProposed: string;
}

export default function IdeaGeneratorDashboard() {
  const [sidebarOpen] = useState(true);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"submit" | "ideas">("ideas");

  // 🔥 Comment states
  const [commentText, setCommentText] = useState("");
  const [commentIdeaId, setCommentIdeaId] = useState<number | null>(null);

  const [] = useState<FormData>({
    title: "",
    description: "",
    problemSolved: "",
    solutionProposed: "",
  });


  const loadIdeas = async () => {
    try {
      setLoading(true);
      const res = await API.get("/idea");

      const ideasWithComments = await Promise.all(
        res.data.map(async (idea: Idea) => {
          try {
            const commentsRes = await API.get(`/comment/idea/${idea.id}`);
            return { ...idea, comments: commentsRes.data };
          } catch {
            return { ...idea, comments: [] };
          }
        })
      );

      setIdeas(ideasWithComments);
    } catch (err) {
      alert("Failed to load ideas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdeas();
  }, []);


  const submitComment = async () => {
    if (!commentText.trim() || !commentIdeaId) return;

    try {
      await API.post("/comment", {
        ideaId: commentIdeaId,
        content: commentText,
      });

      setCommentText("");
      setCommentIdeaId(null);
      loadIdeas();
    } catch {
      alert("Failed to post comment");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-all ${
          sidebarOpen ? "w-64" : "w-0"
        } overflow-hidden z-50`}
      >
        <div className="p-6 h-full flex flex-col">
          <h1 className="text-2xl font-bold text-blue-600 mb-8">IdeaLink</h1>

          <nav className="space-y-2 flex-1">
            <button
              onClick={() => setActiveTab("ideas")}
              className="flex gap-3 px-4 py-3 rounded-lg hover:bg-gray-100"
            >
              <Grid /> My Ideas
            </button>
            <button
              onClick={() => setActiveTab("submit")}
              className="flex gap-3 px-4 py-3 rounded-lg hover:bg-gray-100"
            >
              <PlusCircle /> Submit Idea
            </button>
          </nav>

          <button
            onClick={handleLogout}
            className="flex gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`${sidebarOpen ? "ml-64" : ""} transition-all`}>
        <main className="p-6 max-w-7xl mx-auto">
          {activeTab === "ideas" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-white rounded-xl p-6 shadow hover:shadow-lg"
                >
                  <h3 className="font-bold text-lg">{idea.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mt-2">
                    {idea.description}
                  </p>

                  <div className="flex justify-between mt-4 text-sm">
                    <span>{formatDate(idea.createdAt)}</span>
                    <span>{idea.interestCount || 0} interested</span>
                  </div>

                  <div className="mt-4 border-t pt-3">
                    <p className="text-xs text-gray-500 mb-1">
                      Comments ({idea.comments?.length || 0})
                    </p>

                    {idea.comments?.[0] ? (
                      <p className="text-xs">
                        <strong>{idea.comments[0].user.username}:</strong>{" "}
                        {idea.comments[0].content}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">No comments</p>
                    )}
                  </div>

                  <button
                    onClick={() => setCommentIdeaId(idea.id)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg flex justify-center gap-2"
                  >
                    <MessageSquare size={16} /> Comment
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 💬 Comment Modal */}
      {commentIdeaId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="font-bold mb-3">Add Comment</h3>

            <textarea
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="Write your comment..."
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setCommentIdeaId(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={submitComment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
