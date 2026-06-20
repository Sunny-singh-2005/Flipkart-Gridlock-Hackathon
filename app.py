import { useState } from "react";
import { 
  Building, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  Grid, 
  Sparkles, 
  ClipboardList, 
  BookOpen,
  Map,
  Activity,
  UserCheck
} from "lucide-react";

import ExecutiveSummary from "./components/ExecutiveSummary";
import HotspotDirectory from "./components/HotspotDirectory";
import EnforcementGaps from "./components/EnforcementGaps";
import TemporalPatterns from "./components/TemporalPatterns";
import VehicleRiskProfiling from "./components/VehicleRiskProfiling";
import PriorityMatrix from "./components/PriorityMatrix";
import GeoHeatmap from "./components/GeoHeatmap";
import AiAdvisor from "./components/AiAdvisor";

export default function App() {
  const [activeTab, setActiveTab] = useState("exec");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* City/Official Header Rail */}
      <header className="bg-slate-900 text-white shrink-0 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-wider text-slate-200">Bengaluru City Police</h1>
              <p className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 leading-none mt-1">
                Traffic Enforcement Analytics Console
                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Validated
                </span>
              </p>
            </div>
          </div>
          
          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700/50 flex items-center gap-1.5 text-slate-300">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              Volume: 298,450 Records
            </span>
            <span className="bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700/50 flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Period: Nov 2023 – Apr 2024
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid View */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar Controls */}
        <aside className="lg:col-span-3 flex flex-col gap-2 h-fit bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
            Diagnostic Modules
          </span>

          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab("exec")}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === "exec" 
                  ? "bg-indigo-600 text-white shadow-xs" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-4.5 h-4.5" />
              Executive Console
            </button>

            <button
              onClick={() => setActiveTab("hotspots")}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === "hotspots" 
                  ? "bg-indigo-600 text-white shadow-xs" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <MapPin className="w-4.5 h-4.5" />
              Chronic Hotspots (Task 1)
            </button>

            <button
              onClick={() => setActiveTab("gaps")}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === "gaps" 
                  ? "bg-indigo-600 text-white shadow-xs" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <ShieldAlert className="w-4.5 h-4.5" />
              Enforcement Gaps (Task 2)
            </button>

            <button
              onClick={() => setActiveTab("temporal")}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === "temporal" 
                  ? "bg-indigo-600 text-white shadow-xs" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Clock className="w-4.5 h-4.5" />
              Activity Timelines (Task 3)
            </button>

            <button
              onClick={() => setActiveTab("vehicles")}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === "vehicles" 
                  ? "bg-indigo-600 text-white shadow-xs" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <TrendingUp className="w-4.5 h-4.5" />
              Vehicle Profiles (Task 4)
            </button>

            <button
              onClick={() => setActiveTab("matrix")}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === "matrix" 
                  ? "bg-indigo-600 text-white shadow-xs" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Grid className="w-4.5 h-4.5" />
              Deployment Matrix (Task 5)
            </button>

            <button
              onClick={() => setActiveTab("map")}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === "map" 
                  ? "bg-indigo-600 text-white shadow-xs" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Map className="w-4.5 h-4.5" />
              Interactive Geo Map (Task 6)
            </button>

            <div className="w-full h-px bg-slate-100 my-1"></div>

            <span className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider mt-1">
              Command Resources
            </span>

            <button
              onClick={() => setActiveTab("advisor")}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === "advisor" 
                  ? "bg-indigo-600 text-white shadow-xs" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-4.5 h-4.5" />
              AI Specialist Advisor
            </button>

            <div className="w-full h-px bg-slate-100 my-1"></div>

            <span className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider mt-1">
              Interactive Dashboard
            </span>

            <a
               href="https://flipkart-gridlock-hackathon.streamlit.app/"
               target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 border border-emerald-100"
            >
              <Activity className="w-4.5 h-4.5 text-emerald-600 animate-pulse" />
              View Analytics Dashboard
            </a>
          </nav>
        </aside>

        {/* Content Viewframe */}
        <main className="lg:col-span-9 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-xs flex-1 transition-all">
            
            {/* View Title & External Link */}
            <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-800">
                  {activeTab === "exec" && "Section 1 — Executive Summary Briefing"}
                  {activeTab === "hotspots" && "Section 2 — Chronic Hotspots & Severity Rankings (Task 1)"}
                  {activeTab === "gaps" && "Section 3 — Enforcement Gap Analysis & Diagnostic (Task 2)"}
                  {activeTab === "temporal" && "Section 4 — Temporal Violation & Peak Window Analytics (Task 3)"}
                  {activeTab === "vehicles" && "Section 5 — Vehicle Type Risk Profiling & ANPR Requirements (Task 4)"}
                  {activeTab === "matrix" && "Section 6 & 8 — Priority Matrix & Patrol Schedule (Tasks 5 & 8)"}
                  {activeTab === "map" && "Section 7 — Interactive Geospatial Heatmap & Markers (Task 6)"}
                  {activeTab === "advisor" && "Command Intelligence Node — Grounded AI Assistant"}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {activeTab === "exec" && "High-level overview of traffic offenses and systemic law enforcement guidelines."}
                  {activeTab === "hotspots" && "Ranked directory of Bengaluru's top 20 most severe infraction junctions."}
                  {activeTab === "gaps" && "Detailed volume vs approval rates identifying administrative leakage points."}
                  {activeTab === "temporal" && "Variance maps explaining daily, weekly, and monthly violation cycles."}
                  {activeTab === "vehicles" && "Distribution of violating vehicles and custom automatic plate detection blueprints."}
                  {activeTab === "matrix" && "Strategic 2x2 resource prioritizing model and estimated KPI return ratios."}
                  {activeTab === "map" && "Geographical canvas projecting chronic locations and multi-layered density heat vectors."}
                  {activeTab === "advisor" && "Secure server-side LLM interface trained on our specific Bengaluru violation findings."}
                </p>
              </div>

              {/* View Analytics Dashboard CTA for ALL diagnostic modules */}
              <a
                  href="https://flipkart-gridlock-hackathon.streamlit.app/"
                 target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0 flex items-center gap-2 border border-emerald-500/50"
              >
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                View Analytics Dashboard &rarr;
              </a>
            </div>

            {/* Render selected frame tab */}
            {activeTab === "exec" && <ExecutiveSummary onTabChange={setActiveTab} />}
            {activeTab === "hotspots" && <HotspotDirectory />}
            {activeTab === "gaps" && <EnforcementGaps />}
            {activeTab === "temporal" && <TemporalPatterns />}
            {activeTab === "vehicles" && <VehicleRiskProfiling />}
            {activeTab === "matrix" && <PriorityMatrix />}
            {activeTab === "map" && <GeoHeatmap />}
            {activeTab === "advisor" && <AiAdvisor />}

          </div>
        </main>
      </div>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs font-semibold text-slate-500 shrink-0">
        <p>© 2026 Bengaluru Police Department Operational Informatics | Analytics Division</p>
      </footer>
    </div>
  );
}
