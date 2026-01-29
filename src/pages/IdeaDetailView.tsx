import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import CommentSection from "../components/CommentSection";

export default function IdeaDetailView() {
  const { id } = useParams();
  const [idea, setIdea] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const load = async () => {
    const res = await API.get(`/idea/${id}`);
    setIdea(res.data);
  };

  const loadUser = () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Failed to parse user data:", err);
      }
    }
  };

  useEffect(() => {
    if (id) {
      load();
      loadUser();
    }
  }, [id]);

  const express = async () => {
    try {
      await API.post("/interest", { ideaId: Number(id) });
      alert("Interest expressed");
      load(); // Refresh idea for updated interestCount
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  if (!idea) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Idea Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{idea.title}</h1>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <span>By: <span className="font-semibold">{idea.author?.username}</span></span>
          <span>•</span>
          <span className="text-purple-600 font-semibold">
            {typeof idea.interestCount === "number" ? idea.interestCount : 0} interested
          </span>
        </div>

        <p className="text-gray-700 mb-6 whitespace-pre-wrap">{idea.description}</p>

        {idea.problemSolved && (
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Problem Solved:</h3>
            <p className="text-gray-700">{idea.problemSolved}</p>
          </div>
        )}

        {idea.solutionProposed && (
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Solution Proposed:</h3>
            <p className="text-gray-700">{idea.solutionProposed}</p>
          </div>
        )}

        <div className="mt-6">
          <button 
            onClick={express} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Express Interest
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <CommentSection 
        ideaId={Number(id)} 
        currentUserId={currentUserId}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}