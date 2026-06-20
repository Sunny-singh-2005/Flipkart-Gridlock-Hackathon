import { ShieldAlert, TrendingUp, AlertTriangle, AlertCircle, Sparkles, Activity } from "lucide-react";
import { TOTAL_RECORDS, ANALYSIS_PERIOD, CITY } from "../data";

interface ExecutiveSummaryProps {
  onTabChange: (tab: string) => void;
}

export default function ExecutiveSummary({ onTabChange }: ExecutiveSummaryProps) {
  return (
    <div id="executive-summary" className="space-y-6">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs hover:border-indigo-100 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Violations</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{TOTAL_RECORDS.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 mt-1">Processed citywide records</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs hover:border-red-100 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Critical Enforcement Gaps</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">4 Police Stations</h3>
            <p className="text-xs text-red-500 mt-1 font-medium">Approval Rate &lt; 35%</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs hover:border-amber-100 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Top Hotspot Volume</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">15,449 Offenses</h3>
            <p className="text-xs text-slate-400 mt-1 truncate">Safina Plaza Junction</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs hover:border-cyan-100 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Primary Risk Profile</span>
            <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Two-Wheelers (46%)</h3>
            <p className="text-xs text-slate-400 mt-1">Scooters + Motorcycles</p>
          </div>
        </div>
      </div>

      {/* Critical Data Quality Caveat Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
        <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-amber-800 uppercase tracking-wider">Critical Data Quality Disclaimer</h4>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            The <code className="bg-amber-100 px-1 rounded font-mono text-[10px]">created_datetime</code> field in this dataset reflects 
            <strong> officer batch-upload times</strong>, NOT the actual violation occurrence times. Hourly distributions peaking dramatically 
            at 2–6 AM (with 34K+ logs at 5 AM) are system-entry artifacts and must not be treated as real-world congestion or late-night offence 
            windows without ground-truth physical camera inspection.
          </p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Strategic Policing Initiative Overview</h3>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Through the synthesis of criminal offense statistics in {CITY} during the period {ANALYSIS_PERIOD}, this suite reveals crucial, 
          actionable vectors for local law-enforcement optimization. While traffic officials register high volumes, administrative leakages and 
          manual bottlenecks prevent effective citation processing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-100">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              1. Close Enforcement Gaps
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Target stations like <strong>Kodigehalli (21.6% approval)</strong> and <strong>City Market (34.9%)</strong>. By automating verification workflows 
              and dispatching mobile audit teams, Bengaluru can capture lost revenue pipelines.
            </p>
            <button 
              onClick={() => onTabChange("gaps")} 
              className="text-indigo-600 text-xs font-semibold hover:underline flex items-center gap-1 mt-1 cursor-pointer"
            >
              Examine Enforcement Gaps &rarr;
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              2. Camera ANPR Customization
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              With over <strong>46% of violations</strong> stemming from Scooter and Motorcycle riders, standard horizontal lane cameras fail to read 
              obstructed vertical matrices. ANPR cameras must be calibrated with tail-mounted detection algorithms.
            </p>
            <button 
              onClick={() => onTabChange("vehicles")} 
              className="text-indigo-600 text-xs font-semibold hover:underline flex items-center gap-1 mt-1 cursor-pointer"
            >
              Analyze Camera Settings &rarr;
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              3. Target Chronic Hotspots
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              A tiny core consisting of just **4 junctions** (Safina Plaza, KR Market, Elite, Sagar Theatre) accumulates over **48,254 offenses**. 
              Static, automated deterrent barricades represent the highest return on municipal hardware investments.
            </p>
            <button 
              onClick={() => onTabChange("hotspots")} 
              className="text-indigo-600 text-xs font-semibold hover:underline flex items-center gap-1 mt-1 cursor-pointer"
            >
              Locate Hotspots Directory &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Streamlit Analytics Dashboard CTA Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0 mt-0.5">
            <Activity className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-emerald-800 uppercase tracking-wider">Interactive Python Analytics Hub</h4>
            <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
              Experience the full depth of the Bengaluru Traffic Violation Dataset. Run and interact with the production-ready Streamlit data exploration server locally.
            </p>
          </div>
        </div>
        <a
          href="http://localhost:8501"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0 flex items-center gap-2"
        >
          View Analytics Dashboard
          <span className="text-sm">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
