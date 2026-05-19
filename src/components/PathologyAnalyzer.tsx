import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, ArrowRight, Beaker, CheckCircle2, ChevronRight, Clock, FlaskConical, Search, Zap } from 'lucide-react';

interface Props {
  workflow: any[];
}

export default function PathologyAnalyzer({ workflow }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Pathology Workflow</h2>
          <p className="text-slate-500 text-sm font-medium">Throughput analysis and bottleneck detection</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
           <Zap className="w-4 h-4 text-blue-500 fill-blue-500" />
           <span className="text-xs font-bold text-slate-600">Lab Status: <span className="text-green-600 font-black uppercase tracking-wider">Operational</span></span>
        </div>
      </div>

      {/* Workflow Visualizer */}
      <section className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 skew-x-12 -z-1 translate-x-32" />
        
        <div className="flex items-center justify-between mb-12 relative z-10">
           {workflow.map((step, i) => (
             <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-4 group">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all",
                      step.bottleneck ? "bg-red-500 text-white shadow-red-200" : "bg-white text-[#005EB8] border border-blue-100 shadow-blue-50"
                    )}
                  >
                     {i === 0 ? <FlaskConical /> : i === workflow.length - 1 ? <CheckCircle2 /> : <Beaker />}
                  </motion.div>
                  <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-widest">{step.stage}</p>
                    <p className="text-sm font-medium text-[#768692]">{step.duration}h delay</p>
                  </div>
                  {step.bottleneck && (
                    <span className="absolute -top-4 px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase rounded-full border border-red-200 animate-bounce">
                      Bottleneck
                    </span>
                  )}
                </div>
                {i < workflow.length - 1 && (
                  <div className="flex-1 h-px bg-[#D8DDE0] relative mx-4">
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.5, duration: 1.5 }}
                      className="absolute inset-0 bg-[#005EB8] origin-left"
                    />
                    <ArrowRight className="absolute right-0 -top-2 w-4 h-4 text-[#005EB8]" />
                  </div>
                )}
             </React.Fragment>
           ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
           <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-widest flex items-center gap-2 mb-3">
                 <Zap className="w-4 h-4" />
                 Throughput Score
              </h4>
              <p className="text-4xl font-black text-blue-900 italic">82.4%</p>
              <p className="text-xs font-medium text-blue-700 mt-2">Target benchmark: 95.0%</p>
           </div>
           
           <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
              <h4 className="text-xs font-bold text-red-900 uppercase tracking-widest flex items-center gap-2 mb-3">
                 <AlertTriangle className="w-4 h-4" />
                 Critical Delay Stage
              </h4>
              <p className="text-4xl font-black text-red-900 italic">Sample Prep</p>
              <p className="text-xs font-medium text-red-700 mt-2">+12h above historical variance</p>
           </div>

           <div className="p-6 bg-teal-50 rounded-2xl border border-teal-100">
              <h4 className="text-xs font-bold text-teal-900 uppercase tracking-widest flex items-center gap-2 mb-3">
                 <Clock className="w-4 h-4" />
                 Total Turnaround
              </h4>
              <p className="text-4xl font-black text-teal-900 italic">32.2h</p>
              <p className="text-xs font-medium text-teal-700 mt-2">Predicted drift for next 48h: +4h</p>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <section className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Stage Efficiency Distribution</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workflow}>
                  <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: '#F0F4F8'}} />
                  <Bar dataKey="efficiency" radius={[6, 6, 0, 0]}>
                    {workflow.map((entry, index) => (
                      <Cell key={index} fill={entry.bottleneck ? '#ef4444' : '#005EB8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
         </section>

         <section className="bg-[#002F5C] rounded-xl p-8 text-white border border-blue-900">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-bold text-sm uppercase tracking-widest text-blue-200">Lab Capacity Matrix</h3>
               <Search className="w-4 h-4 text-blue-300" />
            </div>
            
            <div className="space-y-6">
               {[
                 { name: "St Thomas' Central", load: 94, status: "Critical" },
                 { name: "Manchester Bio", load: 72, status: "Healthy" },
                 { name: "Addenbrooke's L3", load: 86, status: "Warning" },
                 { name: "King's College Lab", load: 91, status: "Critical" }
               ].map((lab, i) => (
                 <div key={i} className="flex items-center gap-6">
                    <div className="w-px h-10 bg-blue-800/50" />
                    <div className="flex-1">
                       <p className="text-xs font-bold text-blue-50">{lab.name}</p>
                       <div className="w-full h-1 bg-blue-900 rounded-full mt-2 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${lab.load}%` }}
                            className={cn(
                              "h-full rounded-full",
                              lab.load > 90 ? "bg-red-500" : lab.load > 80 ? "bg-orange-400" : "bg-blue-400"
                            )}
                          />
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-mono">{lab.load}%</p>
                       <p className={cn(
                         "text-[10px] uppercase font-black",
                         lab.status === 'Critical' ? "text-red-500" : "text-green-500"
                       )}>{lab.status}</p>
                    </div>
                 </div>
               ))}
            </div>
         </section>
      </div>
    </motion.div>
  );
}
