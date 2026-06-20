import { useMemo } from "react";
import { MONTHLY_TREND, DAY_OF_WEEK_PATTERN, TOP_JUNCTIONS } from "../data";
import { Clock, AlertCircle, Sparkles, CheckCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 text-white p-2.5 rounded-lg text-[10px]">
        <p className="font-bold">{label}</p>
        <p className="text-indigo-300 mt-0.5">Violations: <span className="font-bold text-white">{payload[0].value.toLocaleString()}</span></p>
      </div>
    );
  }
  return null;
};

export default function TemporalPatterns() {
  const peakJunctions = useMemo(() => {
    // Only extract the top 10 junctions for peak diagnostics
    return TOP_JUNCTIONS.slice(0, 10);
  }, []);

  return (
    <div id="temporal-patterns" className="space-y-6">
      {/* Alert Banner for Batch Upload Caveat */}
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold uppercase tracking-wider">Temporal Data Quality Caution:</span>
          <p className="mt-1 leading-relaxed">
            Spikes recorded during early morning hours (2 AM - 6 AM) are <strong>highly diagnostic of batch uploads</strong> by police officers 
            submitting historical paper/handheld citations in block intervals. They must not be conflated with physical early morning congestion. 
            Conversely, evening spikes (7 PM - 11 PM) correlate tightly with real-world evening rush hour blockages.
          </p>
        </div>
      </div>

      {/* Two Layout Columns for Recharts Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Map */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-800">Monthly Violation Trend</h4>
            <p className="text-xs text-slate-400">Total citations reported over time (Nov 2023 – Apr 2024)</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_TREND} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="monthName" style={{ fontSize: "10px", fill: "#94a3b8" }} />
                <YAxis style={{ fontSize: "10px", fill: "#94a3b8" }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="violations" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-3">*Note: April 2024 reflects a partial month (cut-off reporting period).</p>
        </div>

        {/* Day-of-Week Loop */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-800">Weekly Cycle Distribution</h4>
            <p className="text-xs text-slate-400">Offense volume variance: Weekdays vs Weekend tracking</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DAY_OF_WEEK_PATTERN} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" style={{ fontSize: "10px", fill: "#94a3b8" }} />
                <YAxis style={{ fontSize: "10px", fill: "#94a3b8" }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip content={<CustomChartTooltip />} />
                <Line type="monotone" dataKey="violations" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 1.5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-3">
            *Interpretation: Weekday enforcement averages ~49K/day, dropping relative to Sunday (~32K) due to reduced officer staffing.
          </p>
        </div>
      </div>

      {/* Junction Peak Analysis Container */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-50/30">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Junction Peak Hour Classifications (Top 10 Nodes)</h4>
            <p className="text-xs text-slate-400">Classifying raw hour windows by operational reality to filter data entry artifacts</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[9px] font-bold">
            <span className="flex items-center gap-1 bg-rose-50 text-rose-700 px-2 py-1 rounded-full border border-rose-100">
              <Clock className="w-3 h-3 text-rose-500" /> BATCH UPLOAD (12AM - 6AM)
            </span>
            <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full border border-emerald-100">
              <Sparkles className="w-3 h-3 text-emerald-500" /> GENUINE PEAK (7PM - 11PM)
            </span>
            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100">
              <CheckCircle className="w-3 h-3 text-blue-500" /> DAYTIME ACTIVITY (8AM - 6PM)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="px-6 py-4">Junction Node</th>
                <th className="px-6 py-4 text-center">Peak Hour Window</th>
                <th className="px-6 py-4 text-center">Peak Hour Volume</th>
                <th className="px-6 py-4">Peak Classification</th>
                <th className="px-6 py-4">Audit Diagnosis & Operational Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {peakJunctions.map((j) => (
                <tr key={j.rank} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-4 font-semibold text-slate-800">{j.junction}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-800 bg-slate-50/20">
                    {j.peakHour === 12 ? "12:00 PM (Noon)" : j.peakHour > 12 ? `${j.peakHour - 12}:00 PM` : `${j.peakHour}:00 AM`}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-slate-700">{j.peakViolations.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                      j.peakType === "Likely batch upload" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                      j.peakType === "Genuine peak" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      "bg-blue-50 text-blue-700 border border-blue-100"
                    }`}>
                      {j.peakType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 leading-normal">
                    {j.peakType === "Likely batch upload" && (
                      <span>
                        Officer shift reporting window. Citations logged on hand-held machines were batch synchronization logs. 
                        <strong> Action:</strong> Synchronize devices over LTE in real time to prevent cluster drift.
                      </span>
                    )}
                    {j.peakType === "Genuine peak" && (
                      <span>
                        Corresponds with commercial rush hour bottlenecks. Heavy vehicle density and high footpath parking pressure. 
                        <strong> Action:</strong> Deploy physical patrol squads immediately to clear corridors.
                      </span>
                    )}
                    {j.peakType === "Daytime activity" && (
                      <span>
                        Standard commercial delivery and loading offenses. Double blocking by commercial vans. 
                        <strong> Action:</strong> Institute strict loading zoning bans during high utility slots.
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
