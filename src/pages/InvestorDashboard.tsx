import { useEffect, useState } from "react";
import { LogOut, Briefcase, User, Heart, Search as SearchIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

interface Author {
  username?: string;
  email?: string;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author?: Author;
}

interface Idea {
  id: number;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  interestCount: number;
  author?: Author;
  comments?: Comment[];
  createdAt: string;
}

interface Interest {
  id: number;
  status: string;
  createdAt: string;
  idea: Idea;
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export default function InvestorDashboard() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [myInterests, setMyInterests] = useState<Interest[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"browse" | "interests" | "profile">("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadUserProfile();
    loadData();
  }, []);

  const loadUserProfile = async () => {
    try {
      // Get user info from token or API
      const token = localStorage.getItem("token");
      if (token) {
        // Decode token or fetch user info
        const response = await API.get("/auth/me"); // You may need to add this endpoint
        setUserProfile(response.data);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      // If we can't get profile, at least set basic info
      setUserProfile({
        id: 0,
        username: "Investor",
        email: localStorage.getItem("userEmail") || "user@example.com"
      });
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all approved ideas
      const ideasRes = await API.get("/idea");
      const allIdeas = ideasRes.data.ideas || ideasRes.data;
      
      // Filter to show only approved ideas to investors
      const approvedIdeas = allIdeas.filter((idea: Idea) => idea.status === "approved");
      setIdeas(approvedIdeas);

      // Load user's interests
      try {
        const interestsRes = await API.get("/interests/my-interests");

        setMyInterests(interestsRes.data.interests || []);
      } catch (err) {
        console.error("Error loading interests:", err);
        setMyInterests([]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpressInterest = async (ideaId: number) => {
    try {
      await API.post("/interests/interest", { ideaId });
      alert("Interest expressed successfully!");
      loadData(); // Reload to update counts
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed to express interest";
      alert(errorMsg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleViewIdea = (ideaId: number) => {
    navigate(`/idea/${ideaId}`);
  };

  // Filter ideas based on search and status
  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.author?.username?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || idea.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  const renderBrowseTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-teal-500 text-white placeholder-gray-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-teal-500 text-white"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Ideas Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredIdeas.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No ideas found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.map((idea, index) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 hover:border-teal-500/30 transition-all backdrop-blur-xl"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white flex-1">{idea.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(
                    idea.status
                  )}`}
                >
                  {idea.status}
                </span>
              </div>

              <p className="text-gray-400 mb-4 line-clamp-3">{idea.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {idea.author?.username || "Unknown"}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-400" />
                  {idea.interestCount || 0}
                </span>
              </div>

              {/* Comment Preview */}
              {idea.comments && idea.comments.length > 0 && (
                <div className="bg-gray-800/30 rounded-lg p-3 mb-4 border border-gray-700/50">
                  <p className="text-xs text-gray-500 mb-1">Latest comment:</p>
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {idea.comments[0].content}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => handleViewIdea(idea.id)}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-teal-500/50 transition-all"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleExpressInterest(idea.id)}
                  className="px-4 py-2 bg-gray-800 text-teal-400 rounded-lg hover:bg-gray-700 transition-all border border-teal-500/30"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  const renderInterestsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl font-bold mb-6">My Interests</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : myInterests.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>You haven't expressed interest in any ideas yet</p>
          <button
            onClick={() => setActiveTab("browse")}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-teal-500/50 transition-all"
          >
            Browse Ideas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myInterests.map((interest, index) => (
            <motion.div
              key={interest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 hover:border-teal-500/30 transition-all backdrop-blur-xl"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white flex-1">
                  {interest.idea.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(
                    interest.status
                  )}`}
                >
                  {interest.status}
                </span>
              </div>

              <p className="text-gray-400 mb-4 line-clamp-3">
                {interest.idea.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {interest.idea.author?.username || "Unknown"}
                </span>
                <span className="text-xs">
                  Interested on{" "}
                  {new Date(interest.createdAt).toLocaleDateString()}
                </span>
              </div>

              <button
                onClick={() => handleViewIdea(interest.idea.id)}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-teal-500/50 transition-all"
              >
                View Idea
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  const renderProfileTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 backdrop-blur-xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
            {userProfile?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {userProfile?.username || "User"}
            </h3>
            <p className="text-gray-400">{userProfile?.email || "user@example.com"}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-sm border border-teal-500/30">
              Investor
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <p className="text-gray-400 text-sm mb-1">Total Interests</p>
            <p className="text-3xl font-bold text-teal-400">{myInterests.length}</p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <p className="text-gray-400 text-sm mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-400">
              {myInterests.filter((i) => i.status === "approved").length}
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <p className="text-gray-400 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-400">
              {myInterests.filter((i) => i.status === "pending").length}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Username</label>
            <input
              type="text"
              value={userProfile?.username || ""}
              disabled
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Email</label>
            <input
              type="email"
              value={userProfile?.email || ""}
              disabled
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Member Since</label>
            <input
              type="text"
              value={
                userProfile?.createdAt
                  ? new Date(userProfile.createdAt).toLocaleDateString()
                  : "N/A"
              }
              disabled
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            Investor Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all border border-red-500/30"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="relative z-10 bg-black/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-6 py-4 font-medium transition-all relative ${
                activeTab === "browse"
                  ? "text-teal-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Briefcase className="w-5 h-5 inline mr-2" />
              Browse Ideas
              {activeTab === "browse" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-blue-500"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("interests")}
              className={`px-6 py-4 font-medium transition-all relative ${
                activeTab === "interests"
                  ? "text-teal-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Heart className="w-5 h-5 inline mr-2" />
              My Interests
              {activeTab === "interests" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-blue-500"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-4 font-medium transition-all relative ${
                activeTab === "profile"
                  ? "text-teal-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <User className="w-5 h-5 inline mr-2" />
              Profile
              {activeTab === "profile" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-blue-500"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "browse" && renderBrowseTab()}
          {activeTab === "interests" && renderInterestsTab()}
          {activeTab === "profile" && renderProfileTab()}
        </AnimatePresence>
      </main>
    </div>
  );
}