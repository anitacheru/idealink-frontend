import { useEffect, useState } from "react";
import IdeaCard from "./IdeaCard";
import API from "../services/api";

interface CommentData {
  id: number;
  ideaId: number;
  content: string;
  authorRole: "investor" | "owner";
  createdAt?: string;
}

interface Idea {
  id: number;
  title: string;
  description: string;
  author?: { username?: string; email?: string };
  interestStatus?: "pending" | "accepted" | "rejected" | null;
  interestCount?: number;
  comments?: CommentData[];
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const fetchIdeas = async () => {
    try {
      const ideasRes = await API.get("/ideas");
      const interestsRes = await API.get("/interest");

      // Map interests by ideaId for current user
      const userInterestsMap: Record<number, string> = {};
      interestsRes.data.forEach((i: any) => {
        userInterestsMap[i.idea.id] = i.status;
      });

      // Count total interests per idea
      const interestCountMap: Record<number, number> = {};
      interestsRes.data.forEach((i: any) => {
        interestCountMap[i.idea.id] =
          (interestCountMap[i.idea.id] || 0) + 1;
      });

      // Enrich ideas with current user's interestStatus and total interestCount
      const enrichedIdeas: Idea[] = ideasRes.data.map((idea: Idea) => ({
        ...idea,
        interestStatus: userInterestsMap[idea.id] || null,
        interestCount: interestCountMap[idea.id] || 0,
      }));

      setIdeas(enrichedIdeas);
    } catch (err) {
      console.error("Failed to fetch ideas or interests:", err);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleExpressInterest = async (ideaId: number) => {
    try {
      const res = await API.post("/interest", { ideaId });
      console.log("Interest response:", res.data);

      // Update UI immediately
      setIdeas((prev) =>
        prev.map((idea) =>
          idea.id === ideaId
            ? {
                ...idea,
                interestStatus: "pending",
                interestCount: (idea.interestCount || 0) + 1,
              }
            : idea
        )
      );
    } catch (err: any) {
      console.error(
        "Error expressing interest:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.error || "Failed to express interest.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          id={idea.id}
          title={idea.title}
          description={idea.description}
          author={idea.author}
          interestStatus={idea.interestStatus}
          interestCount={idea.interestCount}
          onExpress={handleExpressInterest}
          comments={idea.comments}
          onCommentAdded={fetchIdeas}
        />
      ))}
    </div>
  );
}
