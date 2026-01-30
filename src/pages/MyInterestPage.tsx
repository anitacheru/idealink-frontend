import { useEffect, useState } from "react";
import {
  Heart,
  Eye,
  MessageSquare,
  Clock,
  User,
  X,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

interface Author {
  id: number;
  username: string;
  email: string;
}

interface Idea {
  id: number;
  title: string;
  description: string;
  problemSolved?: string;
  solutionProposed?: string;
  status: string;
  createdAt: string;
  author: Author;
}

interface Interest {
  id: number;
  ideaId: number;
  investorId: number;
  createdAt: string;
  idea: Idea;
}

export default function MyInterestsPage() {
  const navigate = useNavigate();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [filteredInterests, setFilteredInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
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

  const loadInterests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/interest/my-interests");
      setInterests(res.data);
      setFilteredInterests(res.data);
    } catch (err) {
      console.error("Failed to load interests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterests();
  }, []);

  // Search and filter
  useEffect(() => {
    let filtered = interests;

    if (filterStatus !== "all") {
      filtered = filtered.filter((int) => int.idea.status === filterStatus);
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (int) =>
          int.idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          int.idea.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredInterests(filtered);
  }, [searchQuery, filterStatus, interests]);

  const removeInterest = async (interestId: number) => {
    if (!window.confirm("Remove this idea from your interests?")) return;
    
    try {
      await API.delete(`/interest/${interestId}`);
      loadInterests();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to remove interest");
    }
  };

  const formatDate = (dateString: string) => {
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

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">My Interests</h1>
              <p className="text-gray-400">
                Ideas you're interested in • {interests.length} total
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/investor/dashboard")}
            className="text-[#4ca1af] hover:text-[#3d8da7] mt-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 mb-6 border border-gray-800"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#4ca1af] focus:border-transparent transition-all text-white placeholder-gray-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#4ca1af] focus:border-transparent transition-all text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-[#4ca1af] border-t-transparent rounded-full mx-auto"
            />
            <p className="text-gray-400 mt-4">Loading your interests...</p>
          </div>
        ) : filteredInterests.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Interests Yet</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || filterStatus !== "all"
                ? "No interests match your search/filter"
                : "Start exploring ideas and express your interest!"}
            </p>
            <button
              onClick={() => navigate("/investor/dashboard")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4ca1af] to-[#2c3e50] text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              Explore Ideas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterests.map((interest, index) => (
              <motion.div
                key={interest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-pink-500/50 transition-all relative"
              >
                {/* Remove button */}
                <button
                  onClick={() => removeInterest(interest.id)}
                  className="absolute top-4 right-4 p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                  title="Remove interest"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        interest.idea.status === "pending"
                          ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                          : interest.idea.status === "approved"
                          ? "bg-green-400/20 text-green-400 border border-green-400/30"
                          : "bg-red-400/20 text-red-400 border border-red-400/30"
                      }`}
                    >
                      {interest.idea.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">
                    {interest.idea.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                    {interest.idea.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>By: {interest.idea.author.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Expressed: {formatDate(interest.createdAt)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => setSelectedIdea(interest.idea)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded-lg font-medium transition-all text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </motion.button>
                  <motion.button
                    onClick={() => viewIdeaDetails(interest.idea.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#4ca1af] to-[#2c3e50] text-white py-2 px-3 rounded-lg font-medium transition-all text-sm shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Discuss
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800"
          >
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold">{selectedIdea.title}</h3>
              <button
                onClick={() => setSelectedIdea(null)}
                className="p-2 hover:bg-gray-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedIdea.status === "pending"
                        ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                        : selectedIdea.status === "approved"
                        ? "bg-green-400/20 text-green-400 border border-green-400/30"
                        : "bg-red-400/20 text-red-400 border border-red-400/30"
                    }`}
                  >
                    {selectedIdea.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
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

              <motion.button
                onClick={() => viewIdeaDetails(selectedIdea.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4ca1af] to-[#2c3e50] text-white py-3 px-4 rounded-lg font-semibold shadow-lg"
              >
                View Full Details & Comment
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}