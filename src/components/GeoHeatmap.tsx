import { useState, useMemo } from "react";
import { MapPin, Info, Layers, Eye, ShieldAlert, CheckCircle, Navigation } from "lucide-react";
import { TOP_JUNCTIONS } from "../data";
import { JunctionInfo } from "../types";

export default function GeoHeatmap() {
  const [activeLayer, setActiveLayer] = useState<"BOTH" | "HEAT" | "MARKERS">("BOTH");
  const [selectedJunction, setSelectedJunction] = useState<JunctionInfo | null>(null);
  
  // Bounding box for Bengaluru city center covering our top 15 points snuggly
  const bounds = {
    minLat: 12.9100,
    maxLat: 13.0400,
    minLon: 77.5200,
    maxLon: 77.6400
  };

  // Convert GPS Coordinates to SVG Canvas Coordinates (Percentage-based)
  const projectCoords = (lat: number, lon: number) => {
    const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * 100;
    // Y-axis is inverted in GPS vs SVG viewport
    const y = (1 - (lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100;
    return { x, y };
  };

  // Top 15 junctions with their exact computed points
  const mapJunctions = useMemo(() => {
    return TOP_JUNCTIONS.slice(0, 15).map((j) => {
      const { x, y } = projectCoords(j.latitude, j.longitude);
      return {
        ...j,
        x: Math.min(Math.max(x, 5), 95), // bound slightly inside canvas borders
        y: Math.min(Math.max(y, 5), 95)
      };
    });
  }, []);

  return (
    <div id="geo-heatmap" className="space-y-6">
      {/* Visual Header Control */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-500" /> Layer Management Panel
          </h4>
          <p className="text-xs text-slate-400">Toggle GIS layers to examine raw violation density and specific hot nodes.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveLayer("BOTH")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeLayer === "BOTH" ? "bg-slate-800 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
            }`}
          >
            All Layers On
          </button>
          <button
            onClick={() => setActiveLayer("HEAT")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeLayer === "HEAT" ? "bg-slate-800 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
            }`}
          >
            Density Heatmap Only
          </button>
          <button
            onClick={() => setActiveLayer("MARKERS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeLayer === "MARKERS" ? "bg-slate-800 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
            }`}
          >
            Hotspot Pins Only
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive GIS Canvas Map */}
        <div className="bg-slate-950 rounded-2xl p-4 lg:col-span-8 overflow-hidden relative border border-slate-900 shadow-xl h-[450px]">
          {/* Subtle Grid Map Accents */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          {/* Simulated arterial highway lines in Bengaluru city grid for reference */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            {/* National Highway NH44 & Outer Ring Road Overlay */}
            <path d="M 50,0 Q 55,40 45,100" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4 2" />
            <path d="M 0,45 Q 60,35 100,55" fill="none" stroke="#475569" strokeWidth="1.5" />
            <path d="M 0,25 Q 40,55 100,90" fill="none" stroke="#334155" strokeWidth="1.5" />
            <path d="M 10,90 Q 55,50 90,10" fill="none" stroke="#1e293b" strokeWidth="1" />
            {/* Outer Ring Road Circuit */}
            <circle cx="50" cy="50" r="35" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="5 5" />
          </svg>

          {/* Canvas Wrapper */}
          <div className="relative w-full h-full">
            {/* Layer 1: Simulated Raw Violation Density Thermal Gradients */}
            {(activeLayer === "BOTH" || activeLayer === "HEAT") && (
              <div className="absolute inset-0">
                {mapJunctions.map((j) => {
                  const size = (j.violations / 15449) * 110 + 30; // base scale
                  return (
                    <div
                      key={`heat-${j.rank}`}
                      className="absolute rounded-full pointer-events-none blur-xl mix-blend-screen opacity-40 transition-all duration-700 animate-pulse"
                      style={{
                        left: `${j.x}%`,
                        top: `${j.y}%`,
                        transform: "translate(-50%, -50%)",
                        width: `${size}px`,
                        height: `${size}px`,
                        background: `radial-gradient(circle, ${
                          j.violations > 10000 ? "rgba(239, 68, 68, 0.9)" : "rgba(245, 158, 11, 0.7)"
                        } 0%, rgba(239, 68, 68, 0) 70%)`
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Layer 2: Interactive Junction Markers */}
            {(activeLayer === "BOTH" || activeLayer === "MARKERS") && (
              <div className="absolute inset-0">
                {mapJunctions.map((j) => {
                  const isSelected = selectedJunction?.rank === j.rank;
                  return (
                    <button
                      key={`pin-${j.rank}`}
                      onClick={() => setSelectedJunction(j)}
                      className={`absolute group cursor-pointer transition-all focus:outline-hidden ${
                        isSelected ? "scale-125 z-30" : "hover:scale-110 z-20"
                      }`}
                      style={{ left: `${j.x}%`, top: `${j.y}%`, transform: "translate(-50%, -50%)" }}
                    >
                      {/* Signal beacon ripple effect */}
                      <span className={`absolute inline-flex h-6 w-6 rounded-full opacity-75 animate-ping -left-1.5 -top-1.5 ${
                        j.severity === "CRITICAL" ? "bg-red-400" : j.severity === "HIGH" ? "bg-amber-400" : "bg-blue-400"
                      }`} />
                      
                      {/* Solid marker pin */}
                      <MapPin className={`w-6.5 h-6.5 transition-all drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${
                        j.severity === "CRITICAL" ? "text-red-500 fill-red-950/20" : 
                        j.severity === "HIGH" ? "text-amber-500 fill-amber-950/20" : 
                        "text-indigo-400 fill-indigo-950/20"
                      }`} />
                      
                      {/* Tooltip Hover Overlay */}
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 bg-slate-900 text-white font-mono text-[8px] px-1 rounded opacity-0 group-hover:opacity-100 transition-all uppercase tracking-wider shrink-0 whitespace-nowrap">
                        Rank {j.rank}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            
            {/* North Indicator */}
            <div className="absolute top-4 right-4 flex flex-col items-center gap-1 opacity-60">
              <Navigation className="w-5 h-5 text-slate-400" />
              <span className="text-[9px] font-mono font-semibold text-slate-500">NORTH</span>
            </div>

            {/* General Maps Bound Context */}
            <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded border border-slate-800 text-[9px] font-mono text-slate-400">
              BOUND: LAT 12.91° - 13.04° | LON 77.52° - 77.64°
            </div>
          </div>
        </div>

        {/* Selected Junction Inspector Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between min-h-[450px]">
          {selectedJunction ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                  selectedJunction.severity === "CRITICAL" ? "bg-red-50 text-red-600" :
                  selectedJunction.severity === "HIGH" ? "bg-amber-50 text-amber-600" :
                  "bg-blue-50 text-blue-600"
                }`}>
                  {selectedJunction.rank}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Junction Inspector</h4>
                  <p className="text-[10px] text-slate-400 font-mono">ID: BTP-NODE-0{selectedJunction.rank}</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Junction Segment Name:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedJunction.junction}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-medium text-slate-700">
                  <div>
                    <span className="text-slate-400 text-[10px]">Total Violations</span>
                    <p className="font-bold text-slate-900 text-sm">{selectedJunction.violations.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Citation Tier</span>
                    <p className={`font-bold text-[10px] uppercase mt-0.5 ${
                      selectedJunction.severity === "CRITICAL" ? "text-red-600" : 
                      selectedJunction.severity === "HIGH" ? "text-amber-600" : "text-blue-600"
                    }`}>
                      {selectedJunction.severity}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400">Dominant Mode of Violation:</span>
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    {selectedJunction.topVehicle}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400">Dominant Offence:</span>
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {selectedJunction.topViolation}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400">Citation Validation Screening Approval:</span>
                  <p className={`font-bold flex items-center gap-1.5 ${
                    selectedJunction.approvalRate < 35 ? "text-rose-600" : "text-emerald-600"
                  }`}>
                    {selectedJunction.approvalRate < 35 ? (
                      <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                    )}
                    {selectedJunction.approvalRate}% Approval Rate
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400">Device Upload Peak Timing:</span>
                  <p className="font-semibold text-slate-700 font-mono">
                    {selectedJunction.peakHour}:00 {selectedJunction.peakHour >= 12 ? "PM" : "AM"} ({selectedJunction.peakType})
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3 my-auto">
              <Info className="w-10 h-10 text-slate-300 stroke-1" />
              <div>
                <h5 className="text-xs font-bold text-slate-700">Junction Inspector Standby</h5>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Click on any of the flashing GIS coordinates on the map canvas to project that junction's full enforcement dossier.
                </p>
              </div>
            </div>
          )}

          {/* Quick Map Legend */}
          <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-[9px] font-bold text-slate-500 space-y-1 mt-4">
            <span className="uppercase tracking-wider">Severity Codes:</span>
            <div className="flex justify-between items-center text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500 rounded-full inline-block"></span> Critical</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span> High</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-full inline-block"></span> Medium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
