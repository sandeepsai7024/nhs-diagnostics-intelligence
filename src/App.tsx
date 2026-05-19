import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertCircle, 
  BarChart3, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Database, 
  FileText, 
  LayoutDashboard, 
  Loader2, 
  Map as MapIcon, 
  MessageSquare, 
  Settings, 
  Stethoscope, 
  Users, 
  Zap,
  TrendingDown,
  TrendingUp,
  BrainCircuit,
  Search,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Download,
  Filter
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, LineChart, Line
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatNumber, downloadCSV } from './lib/utils';
import DiagnosticMap from './components/DiagnosticMap';
import PathologyAnalyzer from './components/PathologyAnalyzer';
import StaffingOptimization from './components/StaffingOptimization';
import PredictiveAnalytics from './components/PredictiveAnalytics';

// Types
interface DashboardData {
  regions: any[];
  hospitals: any[];
  trends: any[];
  pathologyWorkflow: any[];
  summary: {
    totalBacklog: number;
    avgWaitTime: string;
    staffingPressure: number;
    cancerPathwayDelays: string;
    highRiskCount: number;
  };
}

interface AIInsights {
  executiveSummary: string;
  bottleneckAnalysis: string;
  recommendations: string[];
  riskScore: number;
  criticalAlerts: string[];
}

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([]);
  const [userQuery, setUserQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/data');
      const dashboardData = await res.json();
      setData(dashboardData);
      
      // Auto-trigger insights on first load
      generateInsights(dashboardData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async (dashboardData: DashboardData) => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dashboardData }),
      });
      const aiInsights = await res.json();
      setInsights(aiInsights);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const newMessages = [...chatMessages, { role: 'user' as const, text: userQuery }];
    setChatMessages(newMessages);
    setUserQuery('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userQuery, context: data }),
      });
      const { answer } = await res.json();
      setChatMessages([...newMessages, { role: 'assistant' as const, text: answer }]);
    } catch (err) {
      setChatMessages([...newMessages, { role: 'assistant' as const, text: "Connectivity error." }]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F0F4F8]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Activity className="w-12 h-12 text-[#005EB8]" />
        </motion.div>
        <p className="mt-4 text-[#005EB8] font-medium font-sans">Initialising NHS Diagnostics Engine...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F0F4F8] text-[#212b32] font-sans selection:bg-[#005EB8] selection:text-white overflow-hidden">
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-[#005EB8] border-r border-blue-400/30 flex flex-col z-20 shadow-xl"
      >
        <div className="p-6 border-b border-blue-400/30">
          <div className="flex items-center gap-3">
            <div className="min-w-[40px] h-10 bg-white flex items-center justify-center rounded shadow-md">
              <Activity className="text-[#005EB8] w-6 h-6" />
            </div>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col overflow-hidden whitespace-nowrap"
              >
                <span className="font-bold text-white text-lg leading-tight tracking-tight">NHS Intelligence</span>
                <span className="text-[10px] text-blue-200 font-semibold uppercase tracking-widest">Diagnostics Port</span>
              </motion.div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto font-sans">
          <SidebarItem icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} expanded={isSidebarOpen} />
          <SidebarItem icon={MapIcon} label="Pressure Map" active={activeTab === 'map'} onClick={() => setActiveTab('map')} expanded={isSidebarOpen} />
          <SidebarItem icon={Database} label="Pathology Analyzer" active={activeTab === 'pathology'} onClick={() => setActiveTab('pathology')} expanded={isSidebarOpen} />
          <SidebarItem icon={Users} label="Staffing Optimization" active={activeTab === 'staffing'} onClick={() => setActiveTab('staffing')} expanded={isSidebarOpen} />
          <SidebarItem icon={TrendingUp} label="Predictive Engine" active={activeTab === 'predictive'} onClick={() => setActiveTab('predictive')} expanded={isSidebarOpen} />
          
          <div className={cn("mt-10 mb-2 px-3 text-[10px] uppercase font-bold text-blue-300/60 tracking-widest", !isSidebarOpen && "hidden")}>Administration</div>
          <SidebarItem icon={BarChart3} label="Performance" active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} expanded={isSidebarOpen} />
          <SidebarItem icon={FileText} label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} expanded={isSidebarOpen} />
          <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} expanded={isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-blue-400/30 flex flex-col gap-4">
          {isSidebarOpen && (
            <div className="bg-blue-600 rounded-xl p-3 border border-blue-400/20">
              <div className="text-[10px] text-blue-200 uppercase font-black tracking-widest mb-1">System Status</div>
              <div className="flex justify-between items-center text-xs text-white">
                <span className="font-medium">Operational</span>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-sm shadow-green-400/50"></span>
              </div>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 text-blue-100 hover:bg-white/5 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5 text-blue-200" /> : <PanelLeftOpen className="w-5 h-5 mx-auto text-blue-200" />}
            {isSidebarOpen && <span className="text-sm">Collapse Sidebar</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <div className="text-xs font-semibold uppercase text-slate-400 tracking-widest">Active Intelligence:</div>
            <h2 className="text-sm font-bold text-slate-800 capitalize tracking-tight px-3 py-1 bg-slate-100 rounded-lg">{activeTab.replace('-', ' ')}</h2>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>Q2 FY26 Operational Window</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Hospital search..." 
                className="pl-9 pr-4 py-1.5 bg-slate-100 border-none focus:ring-1 focus:ring-blue-500/20 focus:bg-white rounded-full text-xs transition-all outline-none w-48 font-medium"
              />
            </div>
            <button 
              onClick={() => downloadCSV(data?.hospitals || [], 'nhs_diagnostic_audit.csv')}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-full hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              Export Audit
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-800">Sarah Jenkins</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Exec Director</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#005EB8] text-xs font-black shadow-sm">
                SJ
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-[#F0F4F8] scroll-smooth">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* KPI Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <KPICard title="Diagnostic Backlog" value={formatNumber(data?.summary.totalBacklog || 0)} trend="+4.2%" trendDir="up" icon={Database} subValue="Last 30 days" />
                  <KPICard title="Avg. Wait time" value={`${data?.summary.avgWaitTime}w`} trend="-0.8w" trendDir="down" icon={Clock} subValue="Target: 6 weeks" />
                  <KPICard title="Lab Utilization" value={`${data?.summary.staffingPressure || 0}%`} trend="+2.1%" trendDir="up" icon={Zap} subValue="Critical threshold: 90%" />
                  <KPICard title="High Risk Patients" value={formatNumber(data?.summary.highRiskCount || 0)} trend="+102" trendDir="up" icon={AlertCircle} subValue="Requiring urgent triage" color="red" />
                </div>

                {/* AI Insights Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <section className="bg-[#002F5C] rounded-2xl p-8 border border-blue-900 shadow-xl relative overflow-hidden group text-white">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BrainCircuit className="w-24 h-24" />
                      </div>
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500 rounded-full flex items-center justify-center">
                            <BrainCircuit className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-200">Gemini Intelligence</h3>
                        </div>
                        {aiLoading ? (
                          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-300 uppercase tracking-widest">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Synthesising...
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400/60 leading-none">ID: OP-74299</span>
                        )}
                      </div>
                      
                      <div className="space-y-6">
                        <p className={cn("text-sm leading-relaxed text-blue-50/90 italic font-medium", !insights && "animate-pulse h-20 bg-white/5 rounded-lg border border-white/10")}>
                          {insights && (
                            <span>&quot;{insights.executiveSummary}&quot;</span>
                          ) || "Initialising deep diagnostic audit across UK pathology nodes..."}
                        </p>
                        
                        {insights && (
                          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
                            <div className="space-y-3">
                              <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle className="w-3 h-3" />
                                Strategic Focal Points
                              </h4>
                              <p className="text-xs text-blue-50 opacity-80 leading-snug">
                                {insights.bottleneckAnalysis}
                              </p>
                            </div>
                            <div className="space-y-3">
                              <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-widest flex items-center gap-2">
                                <Search className="w-3 h-3" />
                                Confidence Scoping
                              </h4>
                              <p className="text-xs text-blue-50 opacity-80 leading-snug">
                                Operational accuracy calculated at 98.4% across regional CT/MRI data sets.
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="pt-4 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                             <button 
                              onClick={() => generateInsights(data!)}
                              className="text-[10px] font-bold bg-[#005EB8] text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 uppercase tracking-widest"
                             >
                              <Zap className="w-3.5 h-3.5" />
                              Re-Calibrate Intelligence
                             </button>
                             <button className="text-[10px] font-black text-blue-300 uppercase tracking-widest hover:text-white transition-colors">Download Briefing</button>
                           </div>
                           <span className="text-[10px] font-bold text-blue-400/60 uppercase">Updated Q2-FY26</span>
                        </div>
                      </div>
                    </section>

                    {/* Main Chart */}
                    <section className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800">Radiology vs Pathology Demand</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">7-Day Rolling Operational Volume</p>
                        </div>
                        <div className="flex gap-3 text-[10px] uppercase font-black tracking-tighter">
                           <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#005EB8] rounded-full"></span> Radiology</span>
                           <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-blue-300 rounded-full"></span> Pathology</span>
                        </div>
                      </div>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={data?.trends}>
                            <defs>
                              <linearGradient id="colorBacklog" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#005EB8" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#005EB8" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F4F8" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#768692', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#768692', fontSize: 12}} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#FFF', 
                                border: '1px solid #D8DDE0', 
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                              }} 
                            />
                            <Area type="monotone" dataKey="backlog" stroke="#005EB8" strokeWidth={3} fillOpacity={1} fill="url(#colorBacklog)" />
                            <Area type="monotone" dataKey="capacity" stroke="#768692" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </section>
                  </div>

                  {/* Sidebar Insights */}
                  <div className="space-y-6">
                    <section className="bg-white rounded-2xl p-6 border border-[#D8DDE0] shadow-sm">
                       <h3 className="text-sm font-bold mb-6 flex items-center justify-between">
                         Regional Risk Radar
                         <span className="text-[10px] text-[#005EB8] hover:underline cursor-pointer">View Map</span>
                       </h3>
                       <div className="space-y-4">
                         {data?.regions.slice(0, 5).map((region, i) => (
                           <div key={i} className="space-y-1.5">
                             <div className="flex justify-between text-xs">
                               <span className="font-semibold">{region.name}</span>
                               <span className={cn(
                                 "font-bold",
                                 region.pressure > 80 ? "text-red-500" : region.pressure > 60 ? "text-orange-500" : "text-green-500"
                               )}>
                                 {region.pressure}%
                               </span>
                             </div>
                             <div className="h-1.5 w-full bg-[#F0F4F8] rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${region.pressure}%` }}
                                 transition={{ delay: i * 0.1, duration: 1 }}
                                 className={cn(
                                   "h-full rounded-full",
                                   region.pressure > 80 ? "bg-red-500" : region.pressure > 60 ? "bg-orange-500" : "bg-green-500"
                                 )}
                               />
                             </div>
                           </div>
                         ))}
                       </div>
                    </section>

                    <section className="bg-gradient-to-br from-[#005EB8] to-[#003087] rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                       <div className="flex items-center gap-3 mb-4">
                         <div className="p-2 bg-white/20 rounded-lg">
                           <Loader2 className="w-5 h-5 text-white" />
                         </div>
                         <h3 className="font-bold">Next Recommended Action</h3>
                       </div>
                       <p className="text-sm text-blue-50 leading-relaxed mb-6">
                         {insights?.recommendations?.[0] || "Redeploy radiology resources from East of England to London Hub to address 14% weekend surge."}
                       </p>
                       <button className="w-full py-2.5 bg-white text-[#005EB8] font-bold rounded-lg text-sm hover:bg-blue-50 transition-all">
                         Initiate Workload Shift
                       </button>
                    </section>

                    <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                       <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Performance Feed</h3>
                       <div className="flex flex-col gap-3">
                          {[
                            { label: "Radiology TAT", val: "-0.4h", up: false },
                            { label: "Pathology Load", val: "+2.1%", up: true },
                            { label: "Staff Sync", val: "OK", up: false }
                          ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-[11px] font-medium border-b border-slate-50 pb-2">
                               <span className="text-slate-500">{item.label}</span>
                               <span className={cn("font-bold", item.up ? "text-red-500" : "text-green-500")}>{item.val}</span>
                            </div>
                          ))}
                       </div>
                    </section>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'map' && (
              <DiagnosticMap regions={data?.regions || []} />
            )}

            {activeTab === 'pathology' && (
              <PathologyAnalyzer workflow={data?.pathologyWorkflow || []} />
            )}

            {activeTab === 'staffing' && (
              <StaffingOptimization hospitals={data?.hospitals || []} />
            )}

            {activeTab === 'predictive' && (
              <PredictiveAnalytics trends={data?.trends || []} />
            )}

            {/* Other views would be implemented similarly */}
            {['performance', 'reports', 'settings'].includes(activeTab) && (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-[500px] text-[#768692]"
              >
                <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                  <Database className="w-12 h-12" />
                </div>
                <h3 className="text-lg font-bold text-[#212b32]">Interface Segment: {activeTab}</h3>
                <p className="max-w-md text-center mt-2">The {activeTab} analytics system is currently synchronising real-time diagnostic feeds. Switch to 'Overview' for live intelligence.</p>
                <button 
                  onClick={() => setActiveTab('overview')}
                  className="mt-6 px-6 py-2 bg-[#005EB8] text-white font-bold rounded-lg"
                >
                  Return to Command Centre
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Chat Assistant FAB */}
        <div className="fixed bottom-8 right-8 z-50">
           <AnimatePresence>
             {chatOpen && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="absolute bottom-20 right-0 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-[#D8DDE0] flex flex-col overflow-hidden"
               >
                 <div className="bg-[#005EB8] p-4 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-white/20 rounded-lg">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm">Ask DNA - Intelligence Assistant</span>
                    </div>
                    <button onClick={() => setChatOpen(false)} className="hover:bg-white/20 p-1 rounded">
                      <PanelLeftClose className="w-4 h-4 rotate-90" />
                    </button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="bg-[#F0F4F8] p-3 rounded-2xl rounded-tl-none mr-12 text-sm leading-relaxed">
                      Hello, I am DNA. I can help you analyse hospital pressure, pathology workflows, and staffing needs. What is your query?
                    </div>
                    {chatMessages.map((m, i) => (
                      <div key={i} className={cn(
                        "p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed",
                        m.role === 'user' ? "ml-auto bg-blue-50 border border-blue-100 rounded-tr-none" : "mr-auto bg-[#F0F4F8] rounded-tl-none"
                      )}>
                        {m.text}
                      </div>
                    ))}
                 </div>
                 <form onSubmit={handleChat} className="p-4 border-t border-[#D8DDE0] flex gap-2">
                    <input 
                      type="text" 
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      placeholder="e.g. Why are MRI delays rising?" 
                      className="flex-1 px-4 py-2 bg-[#F0F4F8] rounded-xl text-sm outline-none focus:bg-white border border-transparent focus:border-[#005EB8] transition-all"
                    />
                    <button type="submit" className="p-2 bg-[#005EB8] text-white rounded-xl hover:bg-[#003087]">
                      <Zap className="w-5 h-5" />
                    </button>
                 </form>
               </motion.div>
             )}
           </AnimatePresence>
           <button 
            onClick={() => setChatOpen(!chatOpen)}
            className="w-14 h-14 bg-[#005EB8] text-white rounded-full shadow-xl shadow-blue-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
           >
              {chatOpen ? <ChevronRight className="w-6 h-6 rotate-90" /> : <MessageSquare className="w-6 h-6" />}
              <span className="absolute right-full mr-4 bg-white text-[#005EB8] px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl border border-blue-50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Ask IQ DNA Assistant
              </span>
           </button>
        </div>
      </main>
    </div>
  );
}

// Sub-components
function SidebarItem({ icon: Icon, label, active, onClick, expanded }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative",
        active ? "bg-white/10 text-white font-bold" : "text-blue-100 hover:bg-white/5 active:bg-white/10"
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", active ? "text-white" : "text-blue-200 group-hover:text-white")} />
      {expanded && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[13px] font-medium tracking-tight overflow-hidden whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}
      {active && <div className="absolute left-0 w-1 h-5 bg-white rounded-r-full" />}
    </button>
  );
}

function KPICard({ title, value, trend, trendDir, icon: Icon, subValue, color = 'blue' }: any) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between h-32">
      <div className="flex justify-between items-start">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</div>
        <motion.div 
          key={trend}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full",
            trendDir === 'up' ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
          )}
        >
          {trendDir === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </motion.div>
      </div>
      
      <div className="flex items-end justify-between">
        <motion.h4 
          key={value}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "text-3xl font-bold tracking-tighter leading-none",
            title.toLowerCase().includes('cancer') ? "text-[#D4351C]" : "text-slate-800"
          )}
        >
          {value}
        </motion.h4>
        <motion.p 
          key={subValue}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] font-medium text-slate-400 capitalize whitespace-nowrap mb-1"
        >
          {subValue}
        </motion.p>
      </div>
    </div>
  );
}
