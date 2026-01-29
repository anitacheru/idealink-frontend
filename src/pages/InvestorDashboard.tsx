import { useEffect, useState } from "react";
import {
  Search,
  Lightbulb,
  TrendingUp,
  Eye,
  Menu,
  X,
  LogOut,
  User,
  Filter,
  Heart,
  Briefcase,
  MessageSquare,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

interface Author {
  username?: string;
  email?: string;
}

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
  status: string;
  createdAt?: string;
  author?: Author;
  comments?: Comment[];
  interestCount?: number;
}

export default function InvestorDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // 🔥 Comment states
  const [commentIdeaId, setCommentIdeaId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");

  // Mouse animation
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      setFilteredIdeas(ideasWithComments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  useEffect(() => {
    let filtered = ideas;

    if (filterStatus !== "all") {
      filtered = filtered.filter((i) => i.status === filterStatus);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredIdeas(filtered);
  }, [searchQuery, filterStatus, ideas]);

  const expressInterest = async (ideaId: number) => {
    await API.post("/interest", { ideaId });
    loadIdeas();
  };

  const submitComment = async () => {
    if (!commentIdeaId || !commentText.trim()) return;

    await API.post("/comment", {
      ideaId: commentIdeaId,
      content: commentText,
    });

    setCommentText("");
    setCommentIdeaId(null);
    loadIdeas();
  };

  const stats = {
    totalIdeas: ideas.length,
    approved: ideas.filter((i) => i.status === "approved").length,
    pending: ideas.filter((i) => i.status === "pending").length,
    comments: ideas.reduce((s, i) => s + (i.comments?.length || 0), 0),
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-[#2c3e50]/20 via-black to-[#4ca1af]/20"
        animate={{ x: mousePosition.x, y: mousePosition.y }}
      />

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed top-0 left-0 h-full w-64 bg-gray-900/60 backdrop-blur-xl border-r border-gray-800 z-50"
          >
            <div className="p-6 flex flex-col h-full">
              <h1 className="text-xl font-bold mb-8">💡 IdeaLink</h1>

              <nav className="space-y-2 flex-1">
                <button className="flex items-center gap-3 px-4 py-3 bg-[#4ca1af]/20 rounded-lg">
                  <Briefcase /> Dashboard
                </button>
              </nav>

                    <button
                      onClick={() => {
                        localStorage.clear();
                        window.location.href = "/login";
                      }}
                    >
                      <LogOut /> Logout
                    </button>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        );
      }
