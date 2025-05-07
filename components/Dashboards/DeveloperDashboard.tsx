"use client";
import React, { useState, useEffect } from "react";
import { FileText, Upload, RefreshCw } from "lucide-react";

const DeveloperDashboard = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/developer/files")
      .then(res => res.json())
      .then(data => {
        setFiles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Developer Dashboard</h2>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-medium text-gray-700">Application Files</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            <Upload size={18} /> Deploy New Version
          </button>
        </div>
        {loading ? (
          <p>Loading files...</p>
        ) : (
          <ul className="space-y-2">
            {files.map((file, i) => (
              <li key={i} className="flex items-center justify-between border p-3 rounded">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-blue-600" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <button className="text-sm text-blue-500 hover:underline">Edit</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-xl font-medium text-gray-700 mb-2">Actions</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          <RefreshCw size={18} /> Refresh System
        </button>
      </section>
    </div>
  );
};

export default DeveloperDashboard;
