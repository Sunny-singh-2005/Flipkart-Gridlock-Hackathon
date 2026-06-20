import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API route first: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Grounded Traffic Assistant API
app.post("/api/chat", async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.status(200).json({
        text: "**AI Assistant Notice**:\n\nThe `GEMINI_API_KEY` is not fully configured in your environment. To enable this real-time AI Traffic Advisor, please go to **Settings > Secrets** in the AI Studio sidebar and add your `GEMINI_API_KEY` variable. \n\n*However, the entire interactive Bengaluru Traffic Enforcement Dashboard, including tables, bubble charts, temporal analysis, vehicle profiling, priority recommendation matrix, and the custom geospatial map is fully operational below!*",
        isDemo: true
      });
    }

    // Lazy instantiate Gemini SDK securely
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // Provide detailed grounded context so the model can speak accurately as a Bengaluru Traffic Expert
    const systemPrompt = `You are the Bengaluru Police Traffic Enforcement Specialist (AI Advisor). You are an expert data analyst and traffic logistics specialist. Your responses must be grounded in the following validated dataset:

DATASET SPECIFICATIONS:
- Subject: Bengaluru Traffic Violations Dataset (Nov 2023 - Apr 2024, anonymized)
- Records analyzed: 298,450 records, City: Bengaluru
- Core Columns: id, latitude, longitude, location, vehicle_number, vehicle_type, violation_type, offence_code, created_datetime, police_station, junction_name, validation_status, device_id, created_by_id, center_code.

CRITICAL DATA QUALITY WARNING (Always point this out if someone asks about hourly peak times):
"The created_datetime field reflects officer upload time, not actual violation occurrence time. Hourly distributions peaking at 2–6 AM (over 34K at 5 AM) are artifacts of batch data entry and should not be interpreted as real-world congestion windows without ground-truth validation."

KEY ANALYSED FINDINGS:
1. Top Hotspot Chronic Junctions (Filtered out "No Junction" records):
   - Safina Plaza (12.9812, 77.6087): 15,449 violations | 42.0% Approval | Top Vehicle: Passenger Auto (Rickshaws have a high peak here of 4,959 rickshaw violations) | Top Violation: Wrong Parking
   - KR Market (12.9644, 77.5772): 11,538 violations | 34.5% Approval | Top Vehicle: Scooter | Top Violation: Footpath Parking | Peak hour: 7 PM (Genuine commercial peak)
   - Elite Junction (12.9766, 77.5766): 10,718 violations | 32.1% Approval | Top Vehicle: Car | Top Violation: No Parking | Peak hour: 3 AM (Likely batch upload)
   - Sagar Theatre (12.9749, 77.5789): 10,549 violations | 33.8% Approval | Top Vehicle: Motor Cycle | Top Violation: Double Parking | Peak hour: 3 AM (Likely batch upload)
   - Central Street (12.9834, 77.6035): 5,388 violations | 56.4% Approval
   - Subbanna Jn. (12.9790, 77.5787): 5,189 violations | 48.2% Approval | Peak hour: 7 PM (Genuine evening peak)
   - Modi Bridge (12.9989, 77.5494): 4,584 violations | 51.5% Approval
   - Hosahalli Metro (12.9741, 77.5453): 4,101 violations | 44.1% Approval | Peak hour: 11 PM (Genuine post-metro evening spillover)

2. Enforcement Gaps (Priority Gaps have total_violations > 5,000 AND approval_rate < 35%):
   - Kodigehalli Station: 10,916 violations, 21.6% approval rate. This is the most critical enforcement gap in the entire city.
   - City Market Station: 17,646 violations, 34.9% approval rate.
   - K.R. Pura Station: 6,546 violations, 33.2% approval rate.
   - Peenya Station: 5,600 violations, 31.5% approval rate.

3. Temporal Insights:
   - Monthly trend: Nov=44K, Dec=63K, Jan=65K, Feb=54K, Mar=55K, Apr=15K (partial month).
   - Day of week: Weekday violation reports are higher (averaging 48K-50K/day) compared to Saturdays (~40K) and Sundays (~32K).
   - Peak Classification:
     * "Likely batch upload" -> 12 AM - 6 AM (e.g., Safina Plaza at 5 AM, Elite Junction at 3 AM, Sagar Theatre at 3 AM).
     * "Genuine peak" -> 7 PM - 11 PM (e.g., KR Market at 7 PM, Subbanna Jn at 7 PM, Hosahalli Metro at 11 PM).
     * "Daytime activity" -> 8 AM - 6 PM (e.g., Central Street at 12 PM).

4. Vehicle Risk Profiles:
   - Overall distribution: Scooter 32%, Car 30%, Motor Cycle 14%, Passenger Auto 13%, Others 11%.
   - Cameras must prioritize 2-wheelers (Scooter + Motor Cycle = 46% of violations, and with moped it's ~50%).
   - Passenger Autos (13%) like Rickshaws are highly concentrated in commercial zones like Safina Plaza.
   - LGV/HGVs cause main-road blocks during delivery hours.

5. Priority Action recommendations:
   - Kodigehalli (Priority 1): Immediate enforcement audit + camera deployment. Patrol: 7 PM - 11 PM.
   - City Market (Priority 2): Increase challan approval pipeline efficiency. Patrol: 6 PM - 10 PM.
   - K.R. Pura (Priority 3): Deploy mobile patrol units. Patrol: Evening peak.
   - Upparpet (Priority 4): Sustain current model, scale to sub-junctions. Patrol: All day.

6. Expected KPIs After Recommendations:
   - If Kodigehalli reaches 40% approval rate, it will yield an additional ~2,000 approved chalans/month.
   - Improving top 3 gap stations leads to an estimated 15% - 20% reduction in repeat violations.

ROLE DIRECTIONS:
- Act as professional, helpful, objective, and friendly.
- When asked complex questions, provide logical, bulleted structures with exact dataset figures.
- Direct users to refer to specific Tabs (Executive Console, Hotspot Directory, Enforcement Gaps, Temporal Patterns, Vehicle profiles, etc.) on the dashboard for detailed charts.
- Keep the response layout clean, nicely spaced, and easy to read in markdown. Do not mention system directories in replies.`;

    const contents = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ error: "Failed to generate AI response. Please verify your GEMINI_API_KEY in Secrets." });
  }
});

// Configure Vite middleware in dev, or serve build outputs in production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite dev middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on public port ${PORT} (Ingress via port 3000 mapping internally)`);
  });
}

setupServer();
