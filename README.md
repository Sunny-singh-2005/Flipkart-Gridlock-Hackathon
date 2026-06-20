# 🚦 ParkSense — AI-Driven Parking Violation Intelligence System

> Transforming raw BTP e-challan records into actionable enforcement intelligence using hotspot detection, gap analysis, and geo-visual dashboards.

---

## 📌 Problem Statement

Urban traffic congestion in Bengaluru is significantly worsened by illegal and spillover parking near commercial zones, metro stations, and busy intersections. Traditional enforcement is entirely **patrol-based and reactive** — there is no systematic mechanism to:

- Identify chronic violation hotspots spatially or temporally
- Quantify the congestion impact of parking violations
- Prioritize deployment of limited enforcement resources

This results in persistent under-enforcement in high-impact zones and inefficient use of BTP personnel.

---

## 🎯 Objective

Build an AI-assisted parking intelligence prototype that:

- Detects spatial and temporal hotspots of illegal parking across Bengaluru
- Quantifies enforcement gaps across police station jurisdictions
- Profiles vehicle types responsible for maximum carriageway obstruction
- Generates prioritized, data-backed enforcement recommendations with predicted KPIs

---

## 📊 Dataset

| Attribute | Detail |
|-----------|--------|
| Source | Bengaluru Traffic Police (BTP) — anonymized e-challan records |
| Period | November 2023 – April 2024 |
| Records | 2,98,450 violations |
| Junctions | 150+ named BTP junctions |
| Stations | 12+ police station jurisdictions |

**Key fields used:**

| Column | Description |
|--------|-------------|
| `junction_name` | Named BTP junction (e.g. BTP051 - Safina Plaza) |
| `violation_type` | Raw list string — NO PARKING / WRONG PARKING / MAIN ROAD etc. |
| `vehicle_type` | SCOOTER / CAR / MOTOR CYCLE / PASSENGER AUTO etc. |
| `latitude`, `longitude` | GPS coordinates of the challan |
| `validation_status` | approved / rejected / created1 / processing / duplicate |
| `police_station` | Jurisdiction (Upparpet / Shivajinagar / Kodigehalli etc.) |
| `created_datetime` | ISO8601 timestamp — reflects officer upload time ⚠️ |

> ⚠️ **Data quality note:** `created_datetime` reflects officer batch-upload time, not actual violation time. The 2–6 AM spike (~34K violations at 5 AM) is an artifact of batch data entry, not a real congestion window. All temporal analysis accounts for this.

---

## 🔍 Methodology

### 1. Data Preprocessing
- Parsed ISO8601 timestamps → extracted `hour`, `day_of_week`, `month` features
- Filtered unnamed junctions (`"No Junction"`) for spatial analysis
- Parsed raw violation type strings into simplified categories
- Derived `is_approved` flag from `validation_status`

### 2. Hotspot Detection
- Grouped violations by `junction_name` → ranked top 20 chronic hotspots
- Assigned severity tiers:

| Tier | Violation Count |
|------|----------------|
| 🔴 CRITICAL | > 10,000 |
| 🟠 HIGH | 5,000 – 10,000 |
| 🟡 MEDIUM | 2,000 – 5,000 |
| 🟢 LOW | < 2,000 |

### 3. Enforcement Gap Analysis
- Computed **approval rate** per police station as enforcement effectiveness proxy
- Flagged Priority Enforcement Gap if: `approval_rate < 35%` AND `violations > 5,000`

### 4. Temporal Pattern Analysis
- Monthly trend: Jan 2024 peak at 65,813 violations
- Per-junction peak hour classified as genuine peak vs batch-upload artifact vs daytime activity

### 5. Vehicle Risk Profiling
- 2-wheelers (Scooter + Motorcycle + Moped) = ~50% of all violations
- Passenger Autos at Safina Plaza flagged as auto-rickshaw encroachment pattern

### 6. Priority Enforcement Matrix
- 2×2 matrix: violation volume vs enforcement approval rate per station
- Generated structured recommendations with patrol windows and projected KPIs

### 7. Geo-Visualization
- Folium interactive heatmap — raw violation density across all records
- Top 15 junction markers color-coded by severity tier

---

## 📈 Key Results

### Top Hotspot Junctions

| Rank | Junction | Violations | Severity | Approval Rate |
|------|----------|-----------|----------|---------------|
| 1 | BTP051 – Safina Plaza | 15,449 | 🔴 CRITICAL | ~44% |
| 2 | BTP082 – KR Market | 11,538 | 🔴 CRITICAL | ~39% |
| 3 | BTP040 – Elite Junction | 10,718 | 🔴 CRITICAL | ~38% |
| 4 | BTP044 – Sagar Theatre | 10,549 | 🔴 CRITICAL | ~37% |
| 5 | BTP211 – Central Street | 5,388 | 🟠 HIGH | ~39% |

> Top 4 junctions alone account for **~16% of all violations citywide**, all within a ~1 km radius in Upparpet/Shivajinagar.

### Enforcement Gap Summary

| Station | Violations | Approval Rate | Status |
|---------|-----------|---------------|--------|
| Kodigehalli | 10,916 | 21.6% | 🔴 CRITICAL GAP |
| City Market | 17,646 | 34.9% | 🟠 HIGH GAP |
| K.R. Pura | 6,546 | 33.2% | 🟠 HIGH GAP |
| Upparpet | 34,468 | 44.7% | ✅ Well-enforced |
| Jeevanbheemanagar | 6,736 | 46.1% | ✅ Well-enforced |

### Vehicle Type Distribution

| Vehicle | Share |
|---------|-------|
| Scooter | 31.8% |
| Car | 29.8% |
| Motor Cycle | 13.7% |
| Passenger Auto | 12.7% |
| Maxi-Cab | 3.8% |

> **Two-wheelers (~50% of violations)** make 2-wheeler number plate detection a non-negotiable requirement for any AI camera deployment.

### Peak Hour Insights

| Junction | Peak Hour | Classification |
|----------|-----------|----------------|
| KR Market | 7 PM | ✅ Genuine evening peak |
| Subbanna Junction | 7 PM | ✅ Genuine evening peak |
| Hosahalli Metro | 11 PM | ✅ Post-metro-hours spillover |
| Safina Plaza | 5 AM | ⚠️ Likely batch upload |
| Elite Junction | 3 AM | ⚠️ Likely batch upload |

---

## 🗂️ Project Structure

```
parksense/
│
├── data/
│   └── jan_to_may_police_violation_anonymized.csv
│
├── notebooks/
│   ├── 01_preprocessing.ipynb
│   ├── 02_hotspot_detection.ipynb
│   ├── 03_enforcement_gap_analysis.ipynb
│   ├── 04_temporal_analysis.ipynb
│   ├── 05_vehicle_profiling.ipynb
│   └── 06_geo_heatmap.ipynb
│
├── app/
│   └── streamlit_dashboard.py
│
├── outputs/
│   ├── hotspot_map.html          ← Folium interactive map
│   ├── enforcement_matrix.png
│   └── priority_recommendations.csv
│
├── requirements.txt
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Tools |
|-------|-------|
| Data processing | Python 3.10+, Pandas, NumPy |
| Visualization | Matplotlib, Seaborn, Plotly |
| Geo mapping | Folium, HeatMap plugin, MarkerCluster plugin |
| Dashboard | Streamlit |
| Notebook | Jupyter Notebook |
| Clustering | Spatial grouping via junction IDs + coordinate aggregation |

---

## ⚙️ Setup & Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/parksense.git
cd parksense

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Run Streamlit dashboard
streamlit run app/streamlit_dashboard.py

# Or open notebooks directly
jupyter notebook notebooks/
```

### requirements.txt

```
pandas>=2.0.0
numpy>=1.24.0
matplotlib>=3.7.0
seaborn>=0.12.0
plotly>=5.14.0
folium>=0.14.0
streamlit>=1.25.0
jupyter>=1.0.0
```

---

## 🗺️ Geo Heatmap — Top 15 Hotspot Coordinates

Pre-computed junction centers for direct use in Folium:

| Junction | Lat | Lon | Violations |
|----------|-----|-----|-----------|
| Safina Plaza | 12.9812 | 77.6087 | 15,449 |
| KR Market | 12.9644 | 77.5772 | 11,538 |
| Elite Junction | 12.9766 | 77.5766 | 10,718 |
| Sagar Theatre | 12.9749 | 77.5789 | 10,549 |
| Central Street | 12.9834 | 77.6035 | 5,388 |
| Subbanna Junction | 12.9790 | 77.5787 | 5,189 |
| Modi Bridge | 12.9989 | 77.5494 | 4,584 |
| Hosahalli Metro | 12.9741 | 77.5453 | 4,101 |
| Anand Rao Junction | 12.9794 | 77.5744 | 3,935 |
| NR Road / SP Road | 12.9644 | 77.5832 | 3,681 |

---

## 🎯 Enforcement Recommendations

| Priority | Station | Recommended Action | Patrol Window |
|----------|---------|-------------------|---------------|
| 🔴 1 | Kodigehalli | Immediate audit + camera deployment | 7 PM – 11 PM |
| 🟠 2 | City Market | Improve challan approval pipeline | 6 PM – 10 PM |
| 🟠 3 | K.R. Pura | Deploy mobile patrol units | Evening peak |
| 🟡 4 | Upparpet | Sustain model, scale to sub-junctions | All day |

**Projected impact:** If top 3 gap stations reach 40% approval rate → estimated **6,000+ additional challans per month** without adding personnel.

---

## 🔭 Future Scope

- Integrate live CCTV or IoT sensor feeds for real-time hotspot alerting
- Add vehicle dwell-time data to quantify carriageway blockage duration per event
- Build a congestion delta model — correlate violation density with Google Maps / HERE Maps speed data to directly quantify parking-induced delay in vehicle-minutes
- Expand to pedestrian footpath encroachment and fire hydrant blockage as separate risk layers
- Generalise pipeline for other Indian metro cities using similar e-challan datasets

---

## 🏛️ Context

This project was built as part of an urban traffic management prototype for **Bengaluru**, using an anonymized dataset from the **Bengaluru Traffic Police (BTP)**. It is intended as a decision-support tool for enforcement planning and does not process or store any personally identifiable information.

---

## 👤 Author

**Sunny Singh**
B.Tech Student | Competitive Programmer | Data & Systems Builder
[GitHub](https://github.com/Sunny-singh-2005)

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.
