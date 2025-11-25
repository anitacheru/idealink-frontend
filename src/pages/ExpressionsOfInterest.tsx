import { useEffect, useState } from "react";
import API from "../services/api";

export default function ExpressionsOfInterest() {
  const [items, setItems] = useState<any[]>([]);
  
  const load = async () => {
    try {
      const res = await API.get("/interest");
      setItems(res.data);
    } catch (err) { console.error(err); }
  };
  
  useEffect(() => { load(); }, []);

  const update = async (id: number, status: string) => {
    try {
      await API.put(`/interest/${id}`, { status });
      alert(`Interest ${status}`);
      load();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Interests</h1>
      <div className="space-y-3">
        {items.map((i) => (
          <div key={i.id} className="bg-white p-3 rounded shadow">
            <p>
              <strong>Idea:</strong> {i.idea?.title} &nbsp;
              <span className="text-purple-600">
                {typeof i.idea?.interestCount === "number" ? i.idea.interestCount : 0} interested
              </span>
            </p>
            <p><strong>Investor:</strong> {i.investor?.username || i.investor?.email}</p>
            <p><strong>Status:</strong> {i.status}</p>
            {i.status === "pending" && (
              <div className="mt-2 flex gap-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => update(i.id, "accepted")}>Accept</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => update(i.id, "rejected")}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
