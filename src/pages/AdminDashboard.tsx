import { useEffect, useState } from "react";
import {
  Users,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  XCircle,
  Menu,
  X,
  LogOut,
  BarChart3,
  MessageSquare,
  Clock,
  Trash2,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import API from "../services/api";

interface Stats {
  ideas: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  users: {
    total: number;
    ideaGenerators: number;
    investors: number;
  };
  engagement: {
    totalInterests: number;
    totalComments: number;
  };
}

interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
    email: string;
  };
  interestCount: number;
  commentCount: number;
  problemSolved?: string;
  solutionProposed?: string;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  ideaCount: number;
  interestCount: number;
  points: number;
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "pending" | "users">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingIdeas, setPendingIdeas] = useState<Idea[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [feedback, setFeedback] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const loadStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data.stats);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const loadPendingIdeas = async () => {
    try {
      const res = await API.get("/admin/ideas/pending");
      setPendingIdeas(res.data);
    } catch (err) {
      console.error("Failed to load pending ideas:", err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadStats();
      await loadPendingIdeas();
      await loadUsers();
      setLoading(false);
    };
    loadData();
  }, []);

  const approveIdea = async (ideaId: number) => {
    try {
      await API.put(`/admin/ideas/${ideaId}/approve`, { feedback });
      alert("✅ Idea approved successfully!");
      setSelectedIdea(null);
      setFeedback("");
      loadStats();
      loadPendingIdeas();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to approve idea");
    }
  };

  const rejectIdea = async (ideaId: number) => {
    try {
      await API.put(`/admin/ideas/${ideaId}/reject`, { feedback });
      alert("❌ Idea rejected");
      setSelectedIdea(null);
      setFeedback("");
      loadStats();
      loadPendingIdeas();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to reject idea");
    }
  };

  const deleteIdea = async (ideaId: number) => {
    if (!window.confirm("Are you sure you want to delete this idea?")) return;
    try {
      await API.delete(`/admin/ideas/${ideaId}`);
      alert("🗑️ Idea deleted");
      loadStats();
      loadPendingIdeas();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete idea");
    }
  };

  const deleteUser = async (userId: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      alert("🗑️ User deleted");
      loadStats();
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete user");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Admin Panel
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
                onClick={() => setActiveTab("overview")}
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all ${
                  activeTab === "overview"
                    ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30"
                    : "hover:bg-gray-800 text-gray-400"
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Overview
              </motion.button>
              <motion.button
                onClick={() => setActiveTab("pending")}
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all ${
                  activeTab === "pending"
                    ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30"
                    : "hover:bg-gray-800 text-gray-400"
                }`}
              >
                <Clock className="w-5 h-5" />
                Pending Ideas
                {stats && stats.ideas.pending > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.ideas.pending}
                  </span>
                )}
              </motion.button>
              <motion.button
                onClick={() => setActiveTab("users")}
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all ${
                  activeTab === "users"
                    ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30"
                    : "hover:bg-gray-800 text-gray-400"
                }`}
              >
                <Users className="w-5 h-5" />
                Users
              </motion.button>
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
                  {activeTab === "overview" && "Dashboard Overview"}
                  {activeTab === "pending" && "Pending Ideas"}
                  {activeTab === "users" && "User Management"}
                </h2>
                <p className="text-sm text-gray-400">
                  {activeTab === "overview" && "Platform statistics and analytics"}
                  {activeTab === "pending" && "Review and approve submitted ideas"}
                  {activeTab === "users" && "Manage platform users"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">Administrator</p>
                <p className="text-xs text-gray-400">Full Access</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center font-semibold shadow-lg">
                A
              </div>
            </div>
          </div>
        </motion.header>

        {/* Dashboard Content */}
        <main className="p-6 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto"
              />
              <p className="text-gray-400 mt-4">Loading dashboard...</p>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === "overview" && stats && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        title: "Total Ideas",
                        value: stats.ideas.total,
                        icon: Lightbulb,
                        gradient: "from-blue-400 to-cyan-500",
                        bgGradient: "from-blue-400/20 to-cyan-500/20",
                      },
                      {
                        title: "Pending Review",
                        value: stats.ideas.pending,
                        icon: Clock,
                        gradient: "from-yellow-400 to-orange-500",
                        bgGradient: "from-yellow-400/20 to-orange-500/20",
                      },
                      {
                        title: "Total Users",
                        value: stats.users.total,
                        icon: Users,
                        gradient: "from-purple-400 to-pink-500",
                        bgGradient: "from-purple-400/20 to-pink-500/20",
                      },
                      {
                        title: "Total Engagement",
                        value: stats.engagement.totalInterests + stats.engagement.totalComments,
                        icon: TrendingUp,
                        gradient: "from-green-400 to-emerald-500",
                        bgGradient: "from-green-400/20 to-emerald-500/20",
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

                  {/* Breakdown Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Ideas Breakdown */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800"
                    >
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-blue-400" />
                        Ideas Status
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Approved</span>
                          <span className="text-green-400 font-bold">{stats.ideas.approved}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Pending</span>
                          <span className="text-yellow-400 font-bold">{stats.ideas.pending}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Rejected</span>
                          <span className="text-red-400 font-bold">{stats.ideas.rejected}</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Users Breakdown */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800"
                    >
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-400" />
                        User Roles
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Idea Generators</span>
                          <span className="text-blue-400 font-bold">{stats.users.ideaGenerators}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Investors</span>
                          <span className="text-purple-400 font-bold">{stats.users.investors}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Total</span>
                          <span className="text-white font-bold">{stats.users.total}</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Engagement */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800"
                    >
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        Engagement
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Total Interests</span>
                          <span className="text-pink-400 font-bold">{stats.engagement.totalInterests}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Total Comments</span>
                          <span className="text-cyan-400 font-bold">{stats.engagement.totalComments}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Combined</span>
                          <span className="text-white font-bold">
                            {stats.engagement.totalInterests + stats.engagement.totalComments}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Pending Ideas Tab */}
              {activeTab === "pending" && (
                <div className="space-y-6">
                  {pendingIdeas.length === 0 ? (
                    <div className="text-center py-16 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800">
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">All Caught Up!</h3>
                      <p className="text-gray-400">No pending ideas to review at the moment.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {pendingIdeas.map((idea, index) => (
                        <motion.div
                          key={idea.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-yellow-500/50 transition-all"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold mb-2">{idea.title}</h3>
                              <p className="text-gray-400 text-sm mb-3">
                                By: {idea.author.username} ({idea.author.email})
                              </p>
                              <p className="text-gray-300 mb-4">{idea.description}</p>
                              
                              {idea.problemSolved && (
                                <div className="mb-3">
                                  <p className="text-sm font-semibold text-gray-400 mb-1">Problem Solved:</p>
                                  <p className="text-sm text-gray-300">{idea.problemSolved}</p>
                                </div>
                              )}
                              
                              {idea.solutionProposed && (
                                <div className="mb-3">
                                  <p className="text-sm font-semibold text-gray-400 mb-1">Solution Proposed:</p>
                                  <p className="text-sm text-gray-300">{idea.solutionProposed}</p>
                                </div>
                              )}

                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {formatDate(idea.createdAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="w-4 h-4" />
                                  {idea.interestCount} interests
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="w-4 h-4" />
                                  {idea.commentCount} comments
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <motion.button
                              onClick={() => setSelectedIdea(idea)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-all"
                            >
                              <Eye className="w-4 h-4" />
                              Review
                            </motion.button>
                            <motion.button
                              onClick={() => {
                                setSelectedIdea(idea);
                                approveIdea(idea.id);
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-lg"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </motion.button>
                            <motion.button
                              onClick={() => {
                                setSelectedIdea(idea);
                                setFeedback("Does not meet platform guidelines");
                                rejectIdea(idea.id);
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-lg"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </motion.button>
                            <motion.button
                              onClick={() => deleteIdea(idea.id)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center justify-center gap-2 bg-red-900/50 hover:bg-red-900/70 text-red-400 py-3 px-4 rounded-lg font-medium transition-all border border-red-500/30"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Users Tab */}
              {activeTab === "users" && (
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">User</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Role</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Ideas</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Interests</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Points</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Joined</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-white">{user.username}</p>
                                <p className="text-sm text-gray-400">{user.email}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  user.role === "admin"
                                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                    : user.role === "investor"
                                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-white">{user.ideaCount}</td>
                            <td className="px-6 py-4 text-white">{user.interestCount}</td>
                            <td className="px-6 py-4 text-white">{user.points || 0}</td>
                            <td className="px-6 py-4 text-gray-400">{formatDate(user.createdAt)}</td>
                            <td className="px-6 py-4">
                              {user.role !== "admin" && (
                                <motion.button
                                  onClick={() => deleteUser(user.id)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </motion.button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Review Modal */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800"
          >
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold">Review Idea</h3>
              <button onClick={() => setSelectedIdea(null)} className="p-2 hover:bg-gray-800 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xl font-bold mb-2">{selectedIdea.title}</h4>
                <p className="text-gray-400 text-sm">
                  By: {selectedIdea.author.username} ({selectedIdea.author.email})
                </p>
              </div>

              <div>
                <h5 className="font-semibold text-gray-300 mb-2">Description:</h5>
                <p className="text-gray-400">{selectedIdea.description}</p>
              </div>

              {selectedIdea.problemSolved && (
                <div>
                  <h5 className="font-semibold text-gray-300 mb-2">Problem Solved:</h5>
                  <p className="text-gray-400">{selectedIdea.problemSolved}</p>
                </div>
              )}

              {selectedIdea.solutionProposed && (
                <div>
                  <h5 className="font-semibold text-gray-300 mb-2">Solution Proposed:</h5>
                  <p className="text-gray-400">{selectedIdea.solutionProposed}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Admin Feedback (Optional):
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none text-white placeholder-gray-500"
                  placeholder="Add feedback for the idea owner..."
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => approveIdea(selectedIdea.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-semibold shadow-lg"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve Idea
                </motion.button>
                <motion.button
                  onClick={() => rejectIdea(selectedIdea.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-4 rounded-lg font-semibold shadow-lg"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Idea
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}