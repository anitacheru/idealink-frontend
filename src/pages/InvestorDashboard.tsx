import { useEffect, useState } from "react";
import { Search, Lightbulb, TrendingUp, Eye, Menu, X, LogOut, User, Filter, Heart, Briefcase } from 'lucide-react';
import API from "../services/api";

interface Author {
  username?: string;
  email?: string;
}

interface Idea {
  id: number;
  title: string;
  description: string;
  problemSolved?: string;
  solutionProposed?: string;
  status: string;
  createdAt?: string;
  author?: Author;
  interestCount?: number;
}

export default function InvestorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  const loadIdeas = async () => {
    try {
      setLoading(true);
      const res = await API.get("/idea");
      setIdeas(res.data);
      setFilteredIdeas(res.data);
    } catch (err) {
      console.error("Failed to load ideas:", err);
      alert("Failed to load ideas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredIdeas(ideas);
    } else {
      const filtered = ideas.filter(idea =>
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredIdeas(filtered);
    }
  }, [searchQuery, ideas]);

  const expressInterest = async (ideaId: number) => {
    try {
      await API.post("/interest", { ideaId });
      alert("✅ Interest expressed successfully!");
      loadIdeas(); // Reload to update interest counts
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to express interest");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate stats
  const stats = {
    totalIdeas: ideas.length,
    approvedIdeas: ideas.filter(i => i.status === 'approved').length,
    pendingIdeas: ideas.filter(i => i.status === 'pending').length,
    myInterests: 0 // You can add an API call to get user's expressed interests
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">IdeaLink</h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="space-y-2">
            <a href="#dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-50 text-indigo-600 font-medium">
              <Briefcase className="w-5 h-5" />
              Dashboard
            </a>
            <a href="#browse" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700">
              <Lightbulb className="w-5 h-5" />
              Browse Ideas
            </a>
            <a href="#interests" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700">
              <Heart className="w-5 h-5" />
              My Interests
            </a>
            <a href="#profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700">
              <User className="w-5 h-5" />
              Profile
            </a>
          </nav>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 w-full mt-auto absolute bottom-6"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Investor</p>
                <p className="text-xs text-gray-500">Discover innovations</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                IV
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Ideas</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalIdeas}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Approved</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.approvedIdeas}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingIdeas}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Filter className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">My Interests</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.myInterests}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search ideas by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Ideas Grid */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Available Ideas</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading ideas...</p>
              </div>
            ) : filteredIdeas.length === 0 ? (
              <div className="text-center py-12">
                <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery ? "No ideas match your search" : "No ideas available yet"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIdeas.map((idea) => (
                  <div key={idea.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all hover:border-indigo-300 bg-gradient-to-br from-white to-indigo-50">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">{idea.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                        idea.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : idea.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {idea.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{idea.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        By: {idea.author?.username || idea.author?.email || "Anonymous"}
                      </span>
                      <span className="flex items-center gap-1 text-purple-600 font-medium">
                        <Heart className="w-3 h-3" />
                        {idea.interestCount || 0}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedIdea(idea)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg font-medium transition-all text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => expressInterest(idea.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-3 rounded-lg font-medium transition-all text-sm shadow-md hover:shadow-lg"
                      >
                        <Heart className="w-4 h-4" />
                        Express Interest
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Idea Detail Modal */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedIdea(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{selectedIdea.title}</h2>
              <button onClick={() => setSelectedIdea(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
                <p className="text-gray-700">{selectedIdea.description}</p>
              </div>

              {selectedIdea.problemSolved && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Problem Solved</h3>
                  <p className="text-gray-700">{selectedIdea.problemSolved}</p>
                </div>
              )}

              {selectedIdea.solutionProposed && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Proposed Solution</h3>
                  <p className="text-gray-700">{selectedIdea.solutionProposed}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Created by</p>
                  <p className="font-medium text-gray-900">{selectedIdea.author?.username || selectedIdea.author?.email || "Anonymous"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{formatDate(selectedIdea.createdAt)}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  expressInterest(selectedIdea.id);
                  setSelectedIdea(null);
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <Heart className="w-5 h-5" />
                Express Interest in this Idea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}