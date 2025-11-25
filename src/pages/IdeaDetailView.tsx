import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function IdeaDetailView() {
  const { id } = useParams();
  const [idea, setIdea] = useState<any>(null);

  const load = async () => {
    const res = await API.get(`/idea/${id}`);
    setIdea(res.data);
  };

  useEffect(() => {
    if (id) load();
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
    <div className="p-6">
      <h1 className="text-2xl font-bold">{idea.title}</h1>
      <p className="mt-2 text-gray-600">{idea.description}</p>
      <p className="mt-3">By: {idea.author?.username}</p>
      <p className="mt-2 text-purple-600">
        {typeof idea.interestCount === "number" ? idea.interestCount : 0} interested
      </p>
      <div className="mt-4">
        <button onClick={express} className="bg-blue-600 text-white px-4 py-2 rounded">
          Express Interest
        </button>
      </div>
    </div>
  );
}
