import { useMemo, useState } from "react";
import { POLICE_STATIONS, PRIORITY_RECOMMENDATION_MATRIX } from "../data";
import { AlertCircle, Zap, ShieldCheck, HeartPulse, FileSpreadsheet, Eye, TrendingUp } from "lucide-react";
import { StationStats } from "../types";

export default function PriorityMatrix() {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  const quadrants = useMemo(() => {
    const q1 = POLICE_STATIONS.filter((s) => s.quadrant === 1);
    const q2 = POLICE_STATIONS.filter((s) => s.quadrant === 2);
    const q3 = POLICE_STATIONS.filter((s) => s.quadrant === 3);
    const q4 = POLICE_STATIONS.filter((s) => s.quadrant === 4);
    return { q1, q2, q3, q4 };
  }, []);

  return (
    <div id="priority-matrix" className="space-y-6">
      {/* 2x2 Matrix Block Grid */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800">2×2 Priority Action Matrix</h4>
          <p className="text-xs text-slate-400">Police stations segmented by violation volumes and approval rates to establish resource optimization priorities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quadrant 1: High Violations, Low Approval Rate (Deploy Now) */}
          <div className="bg-red-50/40 border border-red-100 rounded-xl p-5 hover:bg-red-50/60 transition-all space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-red-100/50 pb-2 mb-2">
                <h5 className="text-xs font-bold text-red-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-red-500 shrink-0" /> Quadrant 1: Deploy Now (Max ROI)
                </h5>
                <span className="text-[10px] bg-red-100/60 text-red-700 px-2 py-0.5 rounded font-bold">Priority Red</span>
              </div>
              <p className="text-[11px] text-red-600 leading-normal">
                High violation volumes combined with low approval rates highlight major operational and vetting bottlenecks. 
                Deploy automated validation checks here immediately.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {quadrants.q1.map((s) => (
                <button
                  key={s.station}
                  onClick={() => setSelectedStation(s.station)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    selectedStation === s.station 
                      ? "bg-red-600 text-white shadow-xs" 
                      : "bg-red-100/40 text-red-700 border border-red-200 hover:bg-red-100"
                  }`}
                >
                  {s.station} ({s.totalViolations.toLocaleString()} | {s.approvalRate}%)
                </button>
              ))}
            </div>
          </div>

          {/* Quadrant 2: High Violations, High Approval Rate (Sustain & Scale) */}
          <div className="bg-amber-50/30 border border-amber-100 rounded-xl p-5 hover:bg-amber-50/50 transition-all space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-amber-100/50 pb-2 mb-2">
                <h5 className="text-xs font-bold text-amber-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-amber-500 shrink-0" /> Quadrant 2: Sustain & Scale Up
                </h5>
                <span className="text-[10px] bg-amber-100/50 text-amber-700 px-2 py-0.5 rounded font-bold">Sustaining</span>
              </div>
              <p className="text-[11px] text-amber-600 leading-normal">
                Stations with high offence levels that already maintain acceptable approval pipelines. 
                Sustain funding and scale up validation structures to adjacent wards.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {quadrants.q2.map((s) => (
                <button
                  key={s.station}
                  onClick={() => setSelectedStation(s.station)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    selectedStation === s.station 
                      ? "bg-amber-600 text-white shadow-xs" 
                      : "bg-amber-100/30 text-amber-700 border border-amber-200 hover:bg-amber-100"
                  }`}
                >
                  {s.station} ({s.totalViolations.toLocaleString()} | {s.approvalRate}%)
                </button>
              ))}
            </div>
          </div>

          {/* Quadrant 3: Low Violations, Low Approval Rate (Monitor) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:bg-slate-100/50 transition-all space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-2 mb-2">
                <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <Eye className="w-4 h-4 text-slate-500 shrink-0" /> Quadrant 3: Monitor (Low Priority)
                </h5>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">Observation</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Quiet regions with low reported citation frequencies. Do not dispatch mobile squads immediately, 
                maintain passive surveillance.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {quadrants.q3.map((s) => (
                <button
                  key={s.station}
                  onClick={() => setSelectedStation(s.station)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    selectedStation === s.station 
                      ? "bg-slate-700 text-white shadow-xs" 
                      : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {s.station} ({s.totalViolations.toLocaleString()} | {s.approvalRate}%)
                </button>
              ))}
            </div>
          </div>

          {/* Quadrant 4: Low Violations, High Approval Rate (Best Practice) */}
          <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-5 hover:bg-emerald-50/50 transition-all space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-emerald-100/50 pb-2 mb-2">
                <h5 className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" /> Quadrant 4: Replicate Best Practice
                </h5>
                <span className="text-[10px] bg-emerald-100/50 text-emerald-700 px-2 py-0.5 rounded font-bold">Standard Model</span>
              </div>
              <p className="text-[11px] text-emerald-600 leading-normal">
                Highly efficient processing cells operating under manageable loads. 
                Replicate their administrative workflows in other, under-performing wards.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {quadrants.q4.map((s) => (
                <button
                  key={s.station}
                  onClick={() => setSelectedStation(s.station)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    selectedStation === s.station 
                      ? "bg-emerald-600 text-white shadow-xs" 
                      : "bg-emerald-100/30 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                  }`}
                >
                  {s.station} ({s.totalViolations.toLocaleString()} | {s.approvalRate}%)
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommend Matrix Table */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/30">
          <FileSpreadsheet className="w-4 h-4 text-slate-500" />
          <div>
            <h4 className="text-sm font-bold text-slate-800">Priority Recommendation Table (Section 8)</h4>
            <p className="text-xs text-slate-400">Calculated patrol schedules, required actions & estimated KPI returns post-intervention</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="px-6 py-4 w-16 text-center">Priority</th>
                <th className="px-6 py-4">Target Station</th>
                <th className="px-6 py-4">Vetting & Patrol Action Required</th>
                <th className="px-6 py-4">Suggested Patrol Window</th>
                <th className="px-6 py-4">Expected Post-Intervention KPI Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {PRIORITY_RECOMMENDATION_MATRIX.map((row) => {
                const isSelected = selectedStation === row.station;
                return (
                  <tr 
                    key={row.priority} 
                    className={`hover:bg-slate-50/50 transition-all ${
                      isSelected ? "bg-indigo-50/40 text-indigo-900 border-l-2 border-indigo-500" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-center font-bold text-slate-500 bg-slate-50/20">{row.priority}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{row.station}</td>
                    <td className="px-6 py-4 font-medium text-slate-600 leading-normal">{row.action}</td>
                    <td className="px-6 py-4 font-bold text-indigo-600 bg-indigo-50/10">{row.suggestedPatrolWindow}</td>
                    <td className="px-6 py-4 text-slate-500 leading-relaxed italic">{row.kpiEstimate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
