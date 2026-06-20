import { useMemo } from "react";
import { VEHICLE_BREAKDOWN } from "../data";
import { Sparkles, Camera, ShieldAlert, Cpu } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts";

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-800 text-white p-2.5 rounded-lg text-[10px]">
        <p className="font-bold">{data.type}</p>
        <p className="text-indigo-300 mt-0.5">Share: <span className="font-bold text-white">{data.percentage}%</span></p>
        <p className="text-slate-400">Est. Counts: {data.count.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function VehicleRiskProfiling() {
  const chartData = useMemo(() => {
    return VEHICLE_BREAKDOWN.map((v) => ({
      name: v.type,
      value: v.percentage,
      count: v.count,
      color: v.color
    }));
  }, []);

  // Preprocessed vehicle breakdown for the top 5 chronic junctions
  const stackedBarData = [
    {
      junction: "Safina Plaza Jn",
      "Passenger Auto": 4959,
      Scooter: 4000,
      Car: 3500,
      "Motor Cycle": 1500,
      "Others (LGV etc)": 1490
    },
    {
      junction: "KR Market Jn",
      "Passenger Auto": 1138,
      Scooter: 5100,
      Car: 2200,
      "Motor Cycle": 2100,
      "Others (LGV etc)": 1000
    },
    {
      junction: "Elite Junction",
      "Passenger Auto": 800,
      Scooter: 3100,
      Car: 4800,
      "Motor Cycle": 1200,
      "Others (LGV etc)": 818
    },
    {
      junction: "Sagar Theatre",
      "Passenger Auto": 900,
      Scooter: 3400,
      Car: 1800,
      "Motor Cycle": 3800,
      "Others (LGV etc)": 649
    },
    {
      junction: "Central Street",
      "Passenger Auto": 400,
      Scooter: 1400,
      Car: 2500,
      "Motor Cycle": 600,
      "Others (LGV etc)": 488
    }
  ];

  return (
    <div id="vehicle-risk-profiling" className="space-y-6">
      {/* 2-Column Section: Donut + Detailed Descriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pie Donut Frame */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-4 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Vehicle Type Distribution</h4>
            <p className="text-xs text-slate-400">Overall statistics of violating modes across Bengaluru</p>
          </div>
          <div className="h-56 flex items-center justify-center my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Primary Risk Mode</span>
            <p className="text-xs text-indigo-600 font-bold">2-Wheelers (Scooter + Bike) constitute 46%</p>
          </div>
        </div>

        {/* Detailed Risk description List */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-8 space-y-4">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-500" /> Mode Offense Categorization
          </h4>
          <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-2">
            {VEHICLE_BREAKDOWN.map((v) => (
              <div key={v.type} className="py-3 first:pt-0 last:pb-0 flex items-start gap-4">
                <span 
                  className="w-3.5 h-3.5 rounded-xs shrink-0 mt-1" 
                  style={{ backgroundColor: v.color }}
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{v.type}</span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                      {v.percentage}% ({v.count.toLocaleString()} cases)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">{v.riskNote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stacked Bar Chart for Top 5 Junctions */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
        <div className="mb-4">
          <h4 className="text-sm font-bold text-slate-800">Top 5 Hotspots Vehicle Composition</h4>
          <p className="text-xs text-slate-400">
            Note the unusually high counts of <strong>Passenger Autos (4,959 rickshaws)</strong> clustering at 
            <strong> Safina Plaza Junction</strong> due to intensive local commercial and shopping taxi activity.
          </p>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={stackedBarData}
              margin={{ top: 10, right: 10, bottom: 10, left: 30 }}
            >
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" style={{ fontSize: "10px", fill: "#94a3b8" }} />
              <YAxis dataKey="junction" type="category" style={{ fontSize: "10px", fill: "#475569", fontWeight: "bold" }} />
              <Tooltip />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }} />
              <Bar dataKey="Passenger Auto" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Scooter" stackId="a" fill="#6366f1" />
              <Bar dataKey="Car" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Motor Cycle" stackId="a" fill="#06b6d4" />
              <Bar dataKey="Others (LGV etc)" stackId="a" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Smart Camera Requirements Specification */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
        <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-700" /> AI Detection Camera System Blueprint
        </h4>
        <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
          Based on the vehicle breakdown, physical traffic cameras in Bengaluru must possess extreme optical flexibility:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg border border-indigo-100/50">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
              <Camera className="w-3.5 h-3.5" /> Two-Wheeler Tail Plate Capture
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Scooters & Motorbikes (~50% together) rarely feature readable front plates. 
              Lens orientation must face down-traffic to capture rear-mounted plate layouts.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-indigo-100/50">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" /> High-Contrast yellow/black OCR
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Passenger Autos (13%) utilize specific yellow/black matrices that blur in standard monochrome settings. 
              OCR pipelines require specialized contrast thresholds.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-indigo-100/50">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
              <ShieldAlert className="w-3.5 h-3.5" /> HGV Multi-Axle Classification
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Large Commercial Goods Vehicles blocking intersections require high-angle classification lenses to detect cargo 
              unloading vectors on active transit routes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
