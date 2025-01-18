import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";

function DataTable({ data, itemsPerPage }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (columnKey) => {
    let direction = "ascending";
    if (sortConfig.key === columnKey && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key: columnKey, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    if (valueA < valueB) return sortConfig.direction === "ascending" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter((item) =>
    item.Domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard. Here is your data:</p>
      </div>

      {/* Search Input */}
      <div className="relative px-4 mb-4">
        <input
          type="text"
          placeholder="Search by Domain"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full pl-10"
        />
        <MagnifyingGlassIcon
          className="absolute left-7 top-2/4 transform -translate-y-2/4 text-gray-500 h-5 w-5"
          aria-hidden="true"
        />
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg border border-gray-200">
          <thead>
            <tr className="bg-blue-500 text-white">
              {[
                "Domain",
                "Niche 1",
                "Niche 2",
                "Traffic",
                "DR",
                "DA",
                "Language",
                "Price",
                "Spam Score",
              ].map((column) => (
                <th
                  key={column}
                  className="px-2 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => handleSort(column)}
                >
                  {column}
                  <span className="ml-2">
                    {sortConfig.key === column ? (
                      sortConfig.direction === "ascending" ? (
                        <ChevronUpIcon className="h-4 w-4 inline" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 inline" />
                      )
                    ) : (
                      <ChevronUpDownIcon className="h-4 w-4 inline" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={index}
                className={`border-b ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="px-2 py-4 text-sm text-gray-800 truncate">{item.Domain}</td>
                <td className="px-2 py-4 text-sm text-gray-800 truncate">{item["Niche 1"]}</td>
                <td className="px-2 py-4 text-sm text-gray-800 truncate">{item["Niche 2"]}</td>
                <td className="px-2 py-4 text-sm text-gray-800">{item.Traffic}</td>
                <td className="px-2 py-4 text-sm text-gray-800">{item.DR}</td>
                <td className="px-2 py-4 text-sm text-gray-800">{item.DA}</td>
                <td className="px-2 py-4 text-sm text-gray-800">{item.Language}</td>
                <td className="px-2 py-4 text-sm text-gray-800">{item.Price}</td>
                <td className="px-2 py-4 text-sm text-gray-800">{item["Spam Score"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center px-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DataTable;
