import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, MapPin, ClipboardList, Percent } from "lucide-react";
import { TOP_JUNCTIONS } from "../data";
import { JunctionInfo } from "../types";

export default function HotspotDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");

  const filteredJunctions = useMemo(() => {
    return TOP_JUNCTIONS.filter((j) => {
      const matchesSearch = j.junction.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            j.topVehicle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            j.topViolation.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeverity = selectedSeverity === "ALL" || j.severity === selectedSeverity;

      return matchesSearch && matchesSeverity;
    });
  }, [searchTerm, selectedSeverity]);

  const stats = useMemo(() => {
    const total = TOP_JUNCTIONS.length;
    const critical = TOP_JUNCTIONS.filter(j => j.severity === "CRITICAL").length;
    const high = TOP_JUNCTIONS.filter(j => j.severity === "HIGH").length;
    const medium = TOP_JUNCTIONS.filter(j => j.severity === "MEDIUM").length;
    return { total, critical, high, medium };
  }, []);

  return (
    <div id="hotspot-directory" className="space-y-6">
      {/* Search and Filters Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search junctions, vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all text-slate-700"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="flex items-center text-slate-400 text-xs font-medium mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
            Filter Severity:
          </div>
          <button
            onClick={() => setSelectedSeverity("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              selectedSeverity === "ALL" 
                ? "bg-slate-800 text-white" 
                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setSelectedSeverity("CRITICAL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              selectedSeverity === "CRITICAL" 
                ? "bg-red-600 text-white" 
                : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            Critical ({stats.critical})
          </button>
          <button
            onClick={() => setSelectedSeverity("HIGH")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              selectedSeverity === "HIGH" 
                ? "bg-amber-600 text-white" 
                : "bg-amber-50 text-amber-600 hover:bg-amber-100"
            }`}
          >
            High ({stats.high})
          </button>
          <button
            onClick={() => setSelectedSeverity("MEDIUM")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              selectedSeverity === "MEDIUM" 
                ? "bg-blue-600 text-white" 
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
            }`}
          >
            Medium ({stats.medium})
          </button>
        </div>
      </div>

      {/* Grid containing tables and fast specs */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="px-6 py-4 w-16 text-center">Rank</th>
                <th className="px-6 py-4">Junction Coordinates & Name</th>
                <th className="px-6 py-4 text-center">Total Violations</th>
                <th className="px-6 py-4 text-center">Severity</th>
                <th className="px-6 py-4">Top Vehicle (Mode)</th>
                <th className="px-6 py-4">Primary Offense Category</th>
                <th className="px-6 py-4 text-center">Approval Rate</th>
                <th className="px-6 py-4 text-center">Coordinates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {filteredJunctions.length > 0 ? (
                filteredJunctions.map((j) => (
                  <tr key={j.rank} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-6 py-4 text-center font-bold text-slate-500 bg-slate-50/20">{j.rank}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {j.junction}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-800">{j.violations.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                        j.severity === "CRITICAL" ? "bg-red-50 text-red-700" :
                        j.severity === "HIGH" ? "bg-amber-50 text-amber-700" :
                        j.severity === "MEDIUM" ? "bg-blue-50 text-blue-700" : "bg-slate-50 text-slate-700"
                      }`}>
                        {j.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">
                        {j.topVehicle}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                        <ClipboardList className="w-3 h-3 text-slate-400 shrink-0" />
                        {j.topViolation}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 font-bold">
                        <Percent className="w-3 h-3 text-slate-400" />
                        <span className={j.approvalRate < 35 ? "text-red-600" : "text-emerald-600"}>
                          {j.approvalRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-[10px] text-slate-400">
                      {j.latitude.toFixed(4)}, {j.longitude.toFixed(4)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-400">
                    No chronic hotspots match your query criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
