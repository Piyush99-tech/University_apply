"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllUniversities, getAllPrograms, createApplicationApi } from "@/lib/api";

export default function StudentUniversitiesPage() {
  const router = useRouter();
  const [universities, setUniversities] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUni, setSelectedUni] = useState("");
  const [selectedProg, setSelectedProg] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [uRes, pRes] = await Promise.all([
          getAllUniversities(),
          getAllPrograms()
        ]);
        setUniversities(uRes?.universities || []);
        setPrograms(pRes?.programs || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCreateApplication = async () => {
    if (!selectedUni || !selectedProg) return;
    try {
      // Find the selected program details to verify it belongs to the university if needed, 
      // but for now we just send IDs.
      const app = await createApplicationApi(selectedProg, selectedUni);
      if (app?.application?.id) {
        router.push(`/student/applications/${app.application.id}`);
      }
    } catch (err) {
      alert("Failed to start application");
      console.error(err);
    }
  }

  // Filter programs based on selected university
  const availablePrograms = programs.filter(p => p.university_id == selectedUni);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Start New Application
          </h1>
          <p className="text-sm text-slate-500">
            Choose your target university and program to begin.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 max-w-2xl">
        {/* University Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Select University</label>
          <select
            className="w-full border p-2 rounded-lg"
            value={selectedUni}
            onChange={(e) => {
              setSelectedUni(e.target.value);
              setSelectedProg(""); // Reset program when uni changes
            }}
          >
            <option value="">-- Choose University --</option>
            {universities.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.short_name})</option>
            ))}
          </select>
        </div>

        {/* Program Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Select Program</label>
          <select
            className="w-full border p-2 rounded-lg"
            value={selectedProg}
            onChange={(e) => setSelectedProg(e.target.value)}
            disabled={!selectedUni}
          >
            <option value="">-- Choose Program --</option>
            {availablePrograms.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.degree_level})</option>
            ))}
          </select>
          {selectedUni && availablePrograms.length === 0 && (
            <p className="text-xs text-red-500 mt-1">No programs found for this university.</p>
          )}
        </div>

        <div className="pt-4">
          <button
            onClick={handleCreateApplication}
            disabled={!selectedUni || !selectedProg}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 hover:bg-blue-700"
          >
            Start Application
          </button>
        </div>

      </div>

      {/* Debug Info (Optional, can remove later) */}
      <div className="mt-8 pt-8 border-t">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">Available Universities (Live Data)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {universities.map(u => (
            <div key={u.id} className="text-xs p-2 border rounded bg-gray-50">
              <span className="font-bold">{u.short_name}</span>: {u.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
