import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "./DataTable";
import { toast } from "react-toastify";

function DashboardPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();


  const sheetId = import.meta.env.VITE_SHEET_ID;
  const apiKey = import.meta.env.VITE_API_KEY;
  const sheetName = import.meta.env.VITE_SHEET_NAME;
  

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("You must be logged in to access the dashboard");
      navigate("/login");
      return;
    }

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error.message || "Failed to fetch data");
        }

        const result = await response.json();
        const rows = result.values;

        
        const formattedData = rows.slice(1).map((row) => ({
          Domain: row[0] || "No Domain",
          "Niche 1": row[1] || "No Niche 1",
          "Niche 2": row[2] || "No Niche 2",
          Traffic: row[3] || "No Traffic",
          DR: row[4] || "No DR",
          DA: row[5] || "No DA",
          Language: row[6] || "No Language",
          Price: row[7] || "No Price",
          "Spam Score": row[8] || "No Spam Score",
        }));

        setData(formattedData);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate, sheetId, apiKey, sheetName]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );

  return (
    <div className="w-screen min-h-screen bg-gray-100">
      <DataTable data={data} itemsPerPage={15} />
    </div>
  );
}

export default DashboardPage;
