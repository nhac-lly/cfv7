import { useEffect, useState } from "react";
import { apiClient } from "../utils/apiClient";

interface DataItem {
 id: number;
 name: string;
 status: string;
}

interface APIResponse {
 data: DataItem[];
}

export default function ExampleComponent() {
 const [data, setData] = useState<DataItem[]>([]);
 const [isStreaming, setIsStreaming] = useState(true);
 const [initialLoading, setInitialLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const fetchData = async () => {
   try {
    await apiClient.request<APIResponse>(
     "/api/stream-data",
     {
      headers: {
       "Content-Type": "application/json",
      },
     },
     // Handle streaming updates
     (partialResponse) => {
      setData(partialResponse.data);
      setInitialLoading(false);
     },
    );
    // Set streaming to false when complete
    setIsStreaming(false);
   } catch (err) {
    setError(err.message);
    setInitialLoading(false);
    setIsStreaming(false);
   }
  };

  fetchData();

  return () => {
   apiClient.destroy();
  };
 }, []);

 if (error) return <div>Error: {error}</div>;
 if (initialLoading) return <div>Loading...</div>;

 return (
  <div className="p-4">
   <h2 className="text-xl font-bold mb-4">Streaming Data</h2>
   <div className="space-y-4">
    {data.map((item) => (
     <div
      key={item.id}
      className="p-4 border rounded-lg shadow animate-fade-in"
     >
      <h3 className="font-semibold">{item.name}</h3>
      <span
       className={`inline-block px-2 py-1 rounded-full text-sm ${
        item.status === "active"
         ? "bg-green-100 text-green-800"
         : item.status === "pending"
           ? "bg-yellow-100 text-yellow-800"
           : "bg-blue-100 text-blue-800"
       }`}
      >
       {item.status}
      </span>
     </div>
    ))}
   </div>
   {isStreaming && (
    <div className="mt-4 text-gray-500">Loading more items...</div>
   )}
  </div>
 );
}
