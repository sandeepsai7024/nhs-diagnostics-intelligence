import React from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BrainCircuit, Loader2, Target, TrendingUp, Zap } from 'lucide-react';

interface Props {
  trends: any[];
}

export default function PredictiveAnalytics({ trends }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 bg-[#002F5C] rounded-xl p-8 text-white relative overflow-hidden border border-blue-900 shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-20">
               <BrainCircuit className="w-16 h-16 text-blue-500" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-200 mb-2">Demand Forecast 2026-27</h2>
            <p className="text-blue-100/70 text-xs max-w-lg mb-8">Probabilistic backlogs analysis across the NHS regional network using AI neural simulation.</p>
            
            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends}>
                    <defs>
                      <linearGradient id="foreCastGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="month" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#002F5C', border: '1px solid #1e3a8a', color: '#fff' }}
                      itemStyle={{ color: '#60a5fa' }}
                    />
                    <Area type="monotone" dataKey="backlog" stroke="#3b82f6" strokeWidth={3} fill="url(#foreCastGradient)" dot={{fill: '#3b82f6', r: 4}} />
                    <Line type="monotone" dataKey="performance" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="space-y-6">
            <section className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
               <div>
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Simulation Engine</h3>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-4 mb-4">
                     <Loader2 className="w-6 h-6 text-[#005EB8] animate-spin" />
                     <p className="text-[10px] uppercase font-black text-[#005EB8] tracking-widest">Crunching scenarios...</p>
                  </div>
                  <div className="space-y-4">
                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status Quo</p>
                        <p className="text-sm font-bold text-slate-800">+12% Growth</p>
                     </div>
                     <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <p className="text-[10px] font-black text-green-700 uppercase mb-1">AI Optimisation</p>
                        <p className="text-sm font-bold text-green-900">-8% Reduction</p>
                     </div>
                  </div>
               </div>
               <button className="mt-8 w-full py-3 bg-[#005EB8] text-white font-bold rounded-xl shadow-lg shadow-blue-100 uppercase tracking-widest text-xs">
                  Run Full Simulation
               </button>
            </section>

            <section className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm">
               <div className="flex items-center gap-4 mb-6">
                  <div className="p-2.5 bg-blue-50 rounded-lg text-[#005EB8]">
                     <Target className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compliance</p>
                     <h4 className="text-sm font-bold text-slate-800">18-Week Referral</h4>
                  </div>
               </div>
               <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  <span>Readiness</span>
                  <span className="text-slate-800 font-bold">64%</span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '64%' }}
                    className="h-full bg-[#005EB8] rounded-full"
                  />
               </div>
               <p className="text-[10px] text-slate-400 mt-4 leading-relaxed font-medium italic">
                  Model failure risk: <span className="text-red-500 font-bold">14% target breach</span> in Nov '26.
               </p>
            </section>
         </div>
      </div>
    </motion.div>
  );
}
