
interface IdeaProps {
  id: number;
  title: string;
  description: string;
  author?: {
    username?: string;
    email?: string;
  };
  onExpress?: (id: number) => void;
}

export default function IdeaCard({ id, title, description, author, onExpress }: IdeaProps) {
  return (
    <div className="bg-white border rounded-xl shadow-md p-4 hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600 mt-2 text-sm">{description}</p>
      <p className="text-xs text-gray-500 mt-2">By: {author?.username || author?.email || "Anonymous"}</p>
      {onExpress && (
        <button
          onClick={() => onExpress(id)}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
        >
          Express Interest
        </button>
      )}
    </div>
  );
}
