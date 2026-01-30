import { useEffect, useState } from "react";
import {
  PlusCircle,
  Lightbulb,
  TrendingUp,
  Clock,
  CheckCircle,
  Menu,
  X,
  LogOut,
  User,
  Grid,
  MessageSquare,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"submit" | "ideas">("ideas");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    problemSolved: "",
    solutionProposed: "",
  });

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate stats
  const stats = {
    totalIdeas: ideas.length,
    pending: ideas.filter((idea) => idea.status === "pending").length,
    approved: ideas.filter((idea) => idea.status === "approved").length,
    interested: ideas.reduce((sum, idea) => sum + (idea.interestCount || 0), 0),
    totalComments: ideas.reduce((sum, idea) => sum + (idea.comments?.length || 0), 0),
  };

  const loadIdeas = async () => {
    try {
      setLoading(true);
      const res = await API.get("/idea");
      const ideasWithComments = await Promise.all(
        res.data.map(async (idea: Idea) => {
          try {
            const commentsRes = await API.get(`/comment/idea/${idea.id}`);
            return { ...idea, comments: commentsRes.data };
          } catch (err) {
            return { ...idea, comments: [] };
          }
        })
      );
      setIdeas(ideasWithComments);
    } catch (err) {
      console.error("Failed to load ideas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/idea", formData);
      setFormData({
        title: "",
        description: "",
        problemSolved: "",
        solutionProposed: "",
      });
      loadIdeas();
      setActiveTab("ideas");
      alert("Idea submitted successfully!");
    } catch (err: any) {
      console.error("Submit error:", err);
      alert(err.response?.data?.error || "Failed to submit idea");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const viewIdeaDetails = (ideaId: number) => {
    navigate(`/idea/${ideaId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2c3e50]/20 via-black to-[#4ca1af]/20" />
        <motion.div
          className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#4ca1af]/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#2c3e50]/10 rounded-full blur-3xl"
          animate={{
            x: -mousePosition.x,
            y: -mousePosition.y,
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="fixed top-0 left-0 h-full w-64 z-50 bg-gray-900/50 backdrop-blur-xl border-r border-gray-800"
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4ca1af] to-[#2c3e50] rounded-xl flex items-center justify-center">
                  <span className="text-xl">💡</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#4ca1af] to-[#2c3e50] bg-clip-text text-transparent">
                  IdeaLink
                </h1>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden hover:bg-gray-800 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-2 flex-1">
              <motion.button
                onClick={() => setActiveTab("ideas")}
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all ${
                  activeTab === "ideas"
                    ? "bg-gradient-to-r from-[#4ca1af]/20 to-[#2c3e50]/20 text-[#4ca1af] border border-[#4ca1af]/30"
                    : "hover:bg-gray-800 text-gray-400"
                }`}
              >
                <Grid className="w-5 h-5" />
                My Ideas
              </motion.button>
              <motion.button
                onClick={() => setActiveTab("submit")}
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all ${
                  activeTab === "submit"
                    ? "bg-gradient-to-r from-[#4ca1af]/20 to-[#2c3e50]/20 text-[#4ca1af] border border-[#4ca1af]/30"
                    : "hover:bg-gray-800 text-gray-400"
                }`}
              >
                <PlusCircle className="w-5 h-5" />
                Submit New Idea
              </motion.button>
              <motion.a
                href="#profile"
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-400 transition-all"
              >
                <User className="w-5 h-5" />
                Profile
              </motion.a>
            </nav>

            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 w-full mt-auto transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </motion.button>
          </div>
        </motion.aside>
      )}

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        } relative z-10`}
      >
        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="sticky top-0 z-40 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800"
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </motion.button>
              <div>
                <h2 className="text-xl font-bold">
                  {activeTab === "submit" ? "Submit New Idea" : "My Ideas Dashboard"}
                </h2>
                <p className="text-sm text-gray-400">
                  {activeTab === "submit"
                    ? "Share your innovation with investors"
                    : "Manage and track your ideas"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">Idea Generator</p>
                <p className="text-xs text-gray-400">Welcome back!</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-[#4ca1af] to-[#2c3e50] rounded-full flex items-center justify-center font-semibold shadow-lg">
                IG
              </div>
            </div>
          </div>
        </motion.header>

        {/* Dashboard Content */}
        <main className="p-6 max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[
              {
                title: "Total Ideas",
                value: stats.totalIdeas,
                icon: Lightbulb,
                gradient: "from-[#4ca1af] to-[#2c3e50]",
                bgGradient: "from-[#4ca1af]/20 to-[#2c3e50]/20",
              },
              {
                title: "Pending",
                value: stats.pending,
                icon: Clock,
                gradient: "from-yellow-400 to-orange-500",
                bgGradient: "from-yellow-400/20 to-orange-500/20",
              },
              {
                title: "Approved",
                value: stats.approved,
                icon: CheckCircle,
                gradient: "from-green-400 to-emerald-500",
                bgGradient: "from-green-400/20 to-emerald-500/20",
              },
              {
                title: "Total Interest",
                value: stats.interested,
                icon: TrendingUp,
                gradient: "from-purple-400 to-pink-500",
                bgGradient: "from-purple-400/20 to-pink-500/20",
              },
              {
                title: "Comments",
                value: stats.totalComments,
                icon: MessageSquare,
                gradient: "from-blue-400 to-cyan-500",
                bgGradient: "from-blue-400/20 to-cyan-500/20",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "submit" ? (
            /* Submit New Idea Form */
            <motion.div
              key="submit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-800"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#4ca1af] to-[#2c3e50] rounded-xl flex items-center justify-center shadow-lg">
                    <PlusCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Submit Your Innovation</h2>
                    <p className="text-gray-400">
                      Share your idea with potential investors worldwide
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Idea Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#4ca1af] focus:border-transparent transition-all text-white placeholder-gray-500"
                        placeholder="Enter a catchy title for your idea..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#4ca1af] focus:border-transparent transition-all resize-none text-white placeholder-gray-500"
                        placeholder="Provide a clear and compelling description..."
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Problem Solved
                        </label>
                        <textarea
                          name="problemSolved"
                          value={formData.problemSolved}
                          onChange={handleChange}
                          rows={5}
                          className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#4ca1af] focus:border-transparent transition-all resize-none text-white placeholder-gray-500"
                          placeholder="What problem does your idea solve?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Proposed Solution
                        </label>
                        <textarea
                          name="solutionProposed"
                          value={formData.solutionProposed}
                          onChange={handleChange}
                          rows={5}
                          className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#4ca1af] focus:border-transparent transition-all resize-none text-white placeholder-gray-500"
                          placeholder="How does your idea solve the problem?"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-4 bg-gradient-to-r from-[#4ca1af] to-[#2c3e50] text-white rounded-lg font-semibold shadow-lg flex items-center justify-center gap-2"
                    >
                      <PlusCircle className="w-5 h-5" />
                      Submit Idea
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setActiveTab("ideas")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 border border-gray-700 text-gray-300 rounded-lg font-semibold hover:bg-gray-800 transition-all"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : (
            /* My Ideas List */
            <motion.div
              key="ideas"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Your Ideas Portfolio</h2>
                  <p className="text-sm text-gray-400">
                    Track and manage all your submitted ideas
                  </p>
                </div>
                <motion.button
                  onClick={() => setActiveTab("submit")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#4ca1af] to-[#2c3e50] text-white px-6 py-3 rounded-lg font-semibold shadow-lg"
                >
                  <PlusCircle className="w-5 h-5" />
                  New Idea
                </motion.button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-[#4ca1af] border-t-transparent rounded-full mx-auto"
                  />
                  <p className="text-gray-400 mt-4">Loading ideas...</p>
                </div>
              ) : ideas.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#4ca1af]/20 to-[#2c3e50]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-10 h-10 text-[#4ca1af]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No ideas yet</h3>
                  <p className="text-gray-400 mb-6">
                    Start by submitting your first innovative idea!
                  </p>
                  <motion.button
                    onClick={() => setActiveTab("submit")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4ca1af] to-[#2c3e50] text-white px-6 py-3 rounded-lg font-semibold shadow-lg"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Submit Your First Idea
                  </motion.button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ideas.map((idea, index) => (
                    <motion.div
                      key={idea.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-black/50 border border-gray-800 rounded-xl p-6 hover:border-[#4ca1af]/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold flex-1 line-clamp-2">
                          {idea.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                            idea.status === "pending"
                              ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                              : idea.status === "approved"
                              ? "bg-green-400/20 text-green-400 border border-green-400/30"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {idea.status}
                        </span>
                      </div>

                      <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                        {idea.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-800">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(idea.createdAt)}
                        </span>
                        <span className="flex items-center gap-1 text-purple-400">
                          <TrendingUp className="w-4 h-4" />
                          {idea.interestCount || 0}
                        </span>
                      </div>

                      {/* Comment preview */}
                      <div className="mb-4 pb-4 border-b border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {idea.comments?.length || 0} Comments
                          </span>
                        </div>
                        {idea.comments && idea.comments.length > 0 ? (
                          <div className="text-xs text-gray-400 bg-gray-800/50 rounded p-2">
                            <p className="font-medium text-[#4ca1af]">
                              {idea.comments[0].user.username}:
                            </p>
                            <p className="line-clamp-2 mt-1">
                              {idea.comments[0].content}
                            </p>
                            {idea.comments.length > 1 && (
                              <p className="text-[#4ca1af] mt-1">
                                +{idea.comments.length - 1} more
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500">No comments yet</p>
                        )}
                      </div>

                      <motion.button
                        onClick={() => viewIdeaDetails(idea.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4ca1af] to-[#2c3e50] text-white py-2 px-3 rounded-lg font-medium transition-all text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View & Comment
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}