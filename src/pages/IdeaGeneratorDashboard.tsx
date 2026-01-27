import React, { useEffect, useState } from "react";
import { PlusCircle, Lightbulb, TrendingUp, Clock, CheckCircle, Menu, X, LogOut, User, Grid } from 'lucide-react';
import API from "../services/api";

interface Idea {
  id: number;
  title: string;
  description: string;
  problemSolved?: string;
  solutionProposed?: string;
  status: string;
  comments?: commentData[];
  createdAt?: string;
  interestCount?: number;
}

interface FormData {
  title: string;
  description: string;
  problemSolved: string;
  solutionProposed: string;
}

interface commentData{
  ideaId:number
  content:string;
  description:string;
}

export default function IdeaGeneratorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'submit' | 'ideas'>('ideas');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    problemSolved: '',
    solutionProposed: ''
  });

  // Calculate stats from ideas
  const stats = {
    totalIdeas: ideas.length,
    pending: ideas.filter(idea => idea.status === 'pending').length,
    approved: ideas.filter(idea => idea.status === 'approved').length,
    interested: ideas.reduce((sum, idea) => sum + (idea.interestCount || 0), 0)
  };

  const loadIdeas = async () => {
    try {
      setLoading(true);
      const res = await API.get("/idea");
      setIdeas(res.data);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/idea", formData);
      alert("Idea submitted successfully!");
      setFormData({
        title: '',
        description: '',
        problemSolved: '',
        solutionProposed: ''
      });
      loadIdeas();
      setActiveTab('ideas'); // Switch to ideas tab after submission
    } catch (err: any) {
      console.error("Submit error:", err);
      alert(err.response?.data?.error || "Failed to submit idea");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-blue-600">IdeaLink</h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('ideas')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left ${
                activeTab === 'ideas' 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Grid className="w-5 h-5" />
              My Ideas
            </button>
            <button 
              onClick={() => setActiveTab('submit')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left ${
                activeTab === 'submit' 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              Submit New Idea
            </button>
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
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {activeTab === 'submit' ? 'Submit New Idea' : 'My Ideas Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">
                  {activeTab === 'submit' ? 'Share your innovation with investors' : 'Manage and track your ideas'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Idea Generator</p>
                <p className="text-xs text-gray-500">Welcome back!</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                IG
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('ideas')}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Ideas</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalIdeas}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Approved</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.approved}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Interest</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.interested}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'submit' ? (
            /* Submit New Idea Form - Full Width */
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <PlusCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Submit Your Innovation</h2>
                    <p className="text-gray-600">Share your idea with potential investors worldwide</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Idea Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                        placeholder="Enter a catchy title for your idea..."
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Provide a clear and compelling description of your idea..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Problem Solved
                      </label>
                      <textarea
                        name="problemSolved"
                        value={formData.problemSolved}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="What problem does your idea solve? Who does it help?"
                      />
                      <p className="text-xs text-gray-500 mt-1">Explain the pain point your idea addresses</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Proposed Solution
                      </label>
                      <textarea
                        name="solutionProposed"
                        value={formData.solutionProposed}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="How does your idea solve the problem? What makes it unique?"
                      />
                      <p className="text-xs text-gray-500 mt-1">Describe your approach and unique value proposition</p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <PlusCircle className="w-5 h-5" />
                      Submit Idea
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('ideas')}
                      className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* My Ideas List - Full Width */
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Your Ideas Portfolio</h2>
                  <p className="text-sm text-gray-500">Track and manage all your submitted ideas</p>
                </div>
                <button
                  onClick={() => setActiveTab('submit')}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  <PlusCircle className="w-5 h-5" />
                  New Idea
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading ideas...</p>
                </div>
              ) : ideas.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No ideas yet</h3>
                  <p className="text-gray-500 mb-6">Start by submitting your first innovative idea!</p>
                  <button
                    onClick={() => setActiveTab('submit')}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Submit Your First Idea
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ideas.map((idea) => (
                    <div key={idea.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all hover:border-blue-300 bg-gradient-to-br from-white to-blue-50">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">{idea.title}</h3>
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
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(idea.createdAt)}
                        </span>
                        <span className="flex items-center gap-1 text-purple-600 font-medium">
                          <TrendingUp className="w-4 h-4" />
                          {idea.interestCount || 0} interested
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}