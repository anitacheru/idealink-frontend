import API from "./api";

export interface Comment {
  id: number;
  content: string;
  ideaId: number;
  userId: number;
  authorRole: "investor" | "idea-generator";
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export const commentService = {
  // Get all comments for an idea
  getCommentsByIdea: async (ideaId: number): Promise<Comment[]> => {
    const response = await API.get(`/comment/idea/${ideaId}`);
    return response.data;
  },

  // Create a new comment
  createComment: async (ideaId: number, content: string): Promise<Comment> => {
    const response = await API.post("/comment", { ideaId, content });
    return response.data;
  },

  // Update a comment
  updateComment: async (commentId: number, content: string): Promise<Comment> => {
    const response = await API.put(`/comment/${commentId}`, { content });
    return response.data;
  },

  // Delete a comment
  deleteComment: async (commentId: number): Promise<void> => {
    await API.delete(`/comment/${commentId}`);
  },
}; 