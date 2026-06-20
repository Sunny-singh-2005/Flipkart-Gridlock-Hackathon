import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, AlertCircle, Bot, User, CornerDownLeft } from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function AiAdvisor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! I am your **Bengaluru Traffic Enforcement AI Advisor**. I am grounded in the 298,450 violation records logged between November 2023 and April 2024.\n\nAsk me anything! For example, you can query:\n* Which police stations have the largest enforcement gaps?\n* What vehicle types present the highest administrative risk profiles?\n* Why does there seem to be a high volume of violations between 2 AM and 6 AM?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const rawMsg = textToSend || input;
    if (!rawMsg.trim()) return;

    const userMessage: Message = { role: "user", text: rawMsg };
    setMessages((prev) => [...prev, userMessage]);
    
    if (!textToSend) {
      setInput("");
    }

    setIsTyping(true);

    try {
      // Map chat history appropriate for the endpoint
      const chatHistory = messages.slice(1).map((m) => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: rawMsg,
          chatHistory: chatHistory
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "model", text: data.text }]);
      } else {
        setMessages((prev) => [
          ...prev, 
          { 
            role: "model", 
            text: `⚠️ **API Error:** ${data.error || "Failed to reach AI advisor. Ensure your API_KEY is configured in Secrets."}` 
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev, 
        { 
          role: "model", 
          text: "⚠️ **Connection Failure:** Could not establish communication with the full-stack server backend. Please wait a moment or check your server logs." 
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (qn: string) => {
    handleSend(qn);
  };

  return (
    <div id="ai-advisor" className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[500px]">
      {/* Quick Suggestions Cards (Sidebar) */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 flex flex-col justify-between space-y-4 h-full overflow-y-auto">
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Suggested Queries</h5>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">Click any card below to automatically query the grounded dataset analysis:</p>
          <div className="space-y-2">
            <button
              onClick={() => handleQuickQuestion("Which police stations have the biggest enforcement gaps?")}
              className="w-full text-left p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-100 transition-all text-slate-700 text-[11px] font-medium leading-normal cursor-pointer"
            >
              📊 Identify Largest Enforcement Gaps
            </button>
            <button
              onClick={() => handleQuickQuestion("Explain the early morning peak hour anomaly.")}
              className="w-full text-left p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-100 transition-all text-slate-700 text-[11px] font-medium leading-normal cursor-pointer"
            >
              ⏰ Early Morning Peak Anomaly Explainer
            </button>
            <button
              onClick={() => handleQuickQuestion("What are the specialized camera specifications required to capture scooter offenses in Bengaluru?")}
              className="w-full text-left p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-100 transition-all text-slate-700 text-[11px] font-medium leading-normal cursor-pointer"
            >
              📷 AI Camera Specifications
            </button>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex gap-2 items-start text-[10px] text-slate-400">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="leading-snug">Answers are computed with a context-window grounded in verified research parameters.</p>
        </div>
      </div>

      {/* Main chat viewport */}
      <div className="lg:col-span-3 bg-white rounded-xl border border-slate-100 flex flex-col justify-between overflow-hidden shadow-xs h-full">
        {/* Chat window viewport */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 max-w-4/5 ${m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
              <div className={`p-2.5 rounded-lg shrink-0 h-9 w-9 flex items-center justify-center ${
                m.role === "user" ? "bg-slate-800 text-white" : "bg-indigo-50 text-indigo-700"
              }`}>
                {m.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-xl text-xs leading-relaxed space-y-2 max-w-full overflow-x-auto ${
                m.role === "user" 
                  ? "bg-slate-800 text-white rounded-tr-none" 
                  : "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100"
              }`}>
                {/* Visual markdown bullet conversion for simple formatting */}
                {m.text.split("\n").map((line, lIdx) => {
                  let formatted = line;
                  // Handle bold indicators (**bold**)
                  const boldRegex = /\*\*(.*?)\*\*/g;
                  formatted = formatted.replace(boldRegex, "<strong>$1</strong>");
                  
                  // Handle bullet markers
                  if (line.trim().startsWith("*")) {
                    return (
                      <li key={lIdx} className="list-disc ml-4 font-medium pl-1" dangerouslySetInnerHTML={{ __html: formatted.replace(/^\*\s*/, "") }} />
                    );
                  }
                  return (
                    <p key={lIdx} className="font-medium" dangerouslySetInnerHTML={{ __html: formatted }} />
                  );
                })}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 mr-auto max-w-4/5">
              <div className="bg-indigo-50 text-indigo-700 p-2.5 rounded-lg shrink-0 h-9 w-9 flex items-center justify-center animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl rounded-tl-none text-xs flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce duration-100"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce duration-300"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce duration-500"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* User prompt writing tray */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Query the Bengaluru Traffic dataset or ask a specialist..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isTyping}
              className="w-full bg-white border border-slate-100 rounded-xl pl-4 pr-16 py-3.5 text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all font-semibold text-slate-700 disabled:opacity-50"
            />
            <span className="absolute right-3 inset-y-0 flex items-center gap-1.5 pointer-events-none text-slate-400 font-mono text-[9px] font-bold">
              <span>Press ENTER</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </span>
          </div>
          <button
            onClick={() => handleSend()}
            disabled={isTyping || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white p-3.5 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
