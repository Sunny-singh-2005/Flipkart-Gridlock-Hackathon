import { useMemo } from "react";
import { AlertCircle, CheckCircle, HelpCircle } from "lucide-react";
import { POLICE_STATIONS } from "../data";
import { StationStats } from "../types";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from "recharts";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data: StationStats = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-800 text-white p-3 rounded-lg shadow-lg text-[10px] space-y-1">
        <p className="font-bold text-xs">{data.station}</p>
        <p><span className="text-slate-400">Total Violations:</span> {data.totalViolations.toLocaleString()}</p>
        <p><span className="text-slate-400">Approval Rate:</span> <span className={data.approvalRate < 35 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>{data.approvalRate}%</span></p>
        <p><span className="text-slate-400">Pending Actions:</span> {data.pendingCount.toLocaleString()}</p>
        <p><span className="text-slate-400">Rejected Citations:</span> {data.rejectedCount.toLocaleString()}</p>
        {data.isGap && (
          <p className="text-red-400 font-semibold animate-pulse mt-1">⚠️ PRIORITY ENFORCEMENT GAP</p>
        )}
      </div>
    );
  }
  return null;
};

export default function EnforcementGaps() {
  const sortedStations = useMemo(() => {
    return [...POLICE_STATIONS].sort((a, b) => {
      // Prioritize gap stations first, then sort by volume descending
      if (a.isGap && !b.isGap) return -1;
      if (!a.isGap && b.isGap) return 1;
      return b.totalViolations - a.totalViolations;
    });
  }, []);

  const totalGaps = useMemo(() => {
    return POLICE_STATIONS.filter(s => s.isGap).length;
  }, []);

  const bubbleData = useMemo(() => {
    return POLICE_STATIONS.map((s) => ({
      ...s,
      bubbleSize: s.rejectedCount // map rejected count to ZAxis for bubble diameter scaling
    }));
  }, []);

  return (
    <div id="enforcement-gaps" className="space-y-6">
      {/* Overview stats */}
      <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 flex-1">
          <h3 className="text-base font-bold tracking-tight">Active Leakage Diagnostic Dashboard</h3>
          <p className="text-xs text-slate-400">
            A station is classified as a <strong className="text-red-400">Priority Enforcement Gap</strong> if its average ticket validation approval rate drop below 
            <span className="text-white font-semibold"> 35%</span> and total submitted violation volume exceeds <span className="text-white font-semibold flex-inline"> 5,000 cases</span>.
          </p>
        </div>
        <div className="flex gap-4 shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500">{totalGaps}</p>
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">Priority Gaps</p>
          </div>
          <div className="w-px bg-slate-700 h-10"></div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-500">
              {POLICE_STATIONS.filter(s => !s.isGap && s.approvalRate >= 35).length}
            </p>
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">Sustaining</p>
          </div>
        </div>
      </div>

      {/* Bubble Chart Container */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Enforcement Gap Scatter Analysis</h4>
            <p className="text-xs text-slate-400">X = Total Violations, Y = Approval Rate %, Size = Rejected Citations Volume</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span> Priority Gaps</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> Sustained</span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <XAxis 
                type="number" 
                dataKey="totalViolations" 
                name="Total Violations" 
                domain={[2000, 20000]}
                tickFormatter={(val) => `${val / 1000}k`}
                style={{ fontSize: "10px", fill: "#64748b" }}
              />
              <YAxis 
                type="number" 
                dataKey="approvalRate" 
                name="Approval Rate" 
                unit="%" 
                domain={[15, 65]}
                style={{ fontSize: "10px", fill: "#64748b" }}
              />
              <ZAxis 
                type="number" 
                dataKey="bubbleSize" 
                range={[80, 800]} 
                name="Rejected Citations"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
              
              {/* Critical threshold line at 35% approval */}
              <ReferenceLine 
                y={35} 
                stroke="#f43f5e" 
                strokeWidth={1.5}
                strokeDasharray="4 4"
                label={{ value: "Critical threshold line: 35% Approval", fill: "#f43f5e", fontSize: 10, position: "top" }} 
              />
              
              <Scatter data={bubbleData}>
                {bubbleData.map((entry, index) => {
                  const isPriorityGap = entry.isGap;
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={isPriorityGap ? "#ef4444" : "#10b981"} 
                      opacity={0.8}
                      stroke={isPriorityGap ? "#b91c1c" : "#047857"}
                      strokeWidth={1}
                    />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Structured metrics table */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Metrics Leaderboard by Police Station</h4>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
            Total nodes audited: {POLICE_STATIONS.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="px-6 py-4">Police Station Node</th>
                <th className="px-6 py-4 text-center">Submitted Violations</th>
                <th className="px-6 py-4 text-center">Approved Citations</th>
                <th className="px-6 py-4 text-center">Rejected cases</th>
                <th className="px-6 py-4 text-center">In-Queue (Pending)</th>
                <th className="px-6 py-4 text-center">Approval Rate %</th>
                <th className="px-6 py-4 text-center">Diagnostic Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {sortedStations.map((s) => (
                <tr key={s.station} className={`hover:bg-slate-50/50 transition-all ${s.isGap ? "bg-red-50/10" : ""}`}>
                  <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-2">
                    {s.station}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-slate-800">{s.totalViolations.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center text-emerald-600 font-medium">{s.approvedCount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center text-rose-500">{s.rejectedCount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center text-slate-400 font-mono">{s.pendingCount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 font-bold">
                      <span className={s.approvalRate < 35 ? "text-red-500" : "text-emerald-500"}>
                        {s.approvalRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {s.isGap ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-bold text-[9px] uppercase tracking-wider">
                        <AlertCircle className="w-3 h-3 text-red-600 shrink-0" /> PRIORITY GAP
                      </span>
                    ) : s.approvalRate < 35 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-medium text-[9px] uppercase tracking-wider">
                        <HelpCircle className="w-3 h-3 text-slate-400 shrink-0" /> Low Rate (Sub-5k)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[9px] uppercase tracking-wider">
                        <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" /> SUSTAINED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
