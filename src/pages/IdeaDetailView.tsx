import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Heart, MessageSquare, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import API from "../services/api";
import CommentSection from "../components/CommentSection";

interface Author {
  id: number;
  username: string;
  email: string;
}

interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
  interestCount: number;
  author?: Author;
  createdAt: string;
}

export default function IdeaDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadCurrentUser();
    if (id) {
      loadIdea();
      checkIfExpressedInterest();
    }
  }, [id]);

  const loadCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await API.get("/auth/me");
        setCurrentUser(response.data);
      }
    } catch (error) {
      console.error("Error loading current user:", error);
    }
  };

  const loadIdea = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/idea/${id}`);
      setIdea(res.data);
    } catch (error) {
      console.error("Error loading idea:", error);
      alert("Failed to load idea");
    } finally {
      setLoading(false);
    }
  };

  const checkIfExpressedInterest = async () => {
    try {
      const res = await API.get("/interest/user");
      const interests = res.data.interests || [];
      const hasInterest = interests.some(
        (interest: any) => interest.ideaId === Number(id)
      );
      setHasExpressedInterest(hasInterest);
    } catch (error) {
      console.error("Error checking interest:", error);
    }
  };

  const expressInterest = async () => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to express interest");
        navigate("/login");
        return;
      }

      await API.post("/interest", { ideaId: Number(id) });
      alert("Interest expressed successfully!");
      setHasExpressedInterest(true);
      loadIdea(); // Refresh to update count
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to express interest";
      alert(errorMsg);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Idea not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg hover:shadow-lg transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          {currentUser && (
            <div className="flex items-center gap-2 text-gray-400">
              <User className="w-5 h-5" />
              <span>{currentUser.username}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 backdrop-blur-xl mb-8"
        >
          {/* Idea Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{idea.title}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <span className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {idea.author?.username || "Unknown"}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {new Date(idea.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm border ${getStatusColor(
                idea.status
              )}`}
            >
              {idea.status}
            </span>
          </div>

          {/* Idea Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-teal-400">Description</h2>
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {idea.description}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {idea.interestCount || 0}
                  </p>
                  <p className="text-sm text-gray-400">People Interested</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    <CommentCount ideaId={Number(id)} />
                  </p>
                  <p className="text-sm text-gray-400">Comments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {currentUser && currentUser.role === "investor" && (
            <button
              onClick={expressInterest}
              disabled={hasExpressedInterest}
              className={`w-full px-6 py-4 rounded-xl font-semibold text-lg transition-all ${
                hasExpressedInterest
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:shadow-lg hover:shadow-teal-500/50"
              }`}
            >
              {hasExpressedInterest ? (
                <span className="flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 fill-current" />
                  Interest Expressed
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Express Interest
                </span>
              )}
            </button>
          )}
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CommentSection ideaId={Number(id)} currentUserId={currentUser?.id} isAuthenticated={!!currentUser}
/>
        </motion.div>
      </main>
    </div>
  );
}

// Helper component to display comment count
function CommentCount({ ideaId }: { ideaId: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const loadCount = async () => {
      try {
        const res = await API.get(`/comment/idea/${ideaId}`);
        setCount(res.data.comments?.length || 0);
      } catch (error) {
        console.error("Error loading comment count:", error);
      }
    };
    loadCount();
  }, [ideaId]);

  return <>{count}</>;
}