interface IdeaProps {
  id: number;
  title: string;
  description: string;
  author?: {
    username?: string;
    email?: string;
  };
  interestCount?: number; // total number of interests
  interestStatus?: "pending" | "accepted" | "rejected" | null; // current user's status
  onExpress?: (id: number) => void;
}

export default function IdeaCard({
  id,
  title,
  description,
  author,
  interestCount = 0,
  interestStatus,
  onExpress,
}: IdeaProps) {
  return (
    <div className="bg-white border rounded-xl shadow-md p-4 hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600 mt-2 text-sm">{description}</p>
      <p className="text-xs text-gray-500 mt-2">
        By: {author?.username || author?.email || "Anonymous"}
      </p>
      <p className="text-sm mt-2 text-purple-600">
        {interestCount} {interestCount === 1 ? "person is" : "people are"} interested
      </p>

      {onExpress && (
        <button
          onClick={() => onExpress(id)}
          disabled={!!interestStatus} // disable if already expressed
          className={`mt-4 text-sm px-4 py-2 rounded-lg text-white ${
            interestStatus
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {interestStatus ? "Pending" : "Express Interest"}
        </button>
      )}
    </div>
  );
}
