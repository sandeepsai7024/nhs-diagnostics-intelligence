import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, BrainCircuit, Heart, Stethoscope, Users, Zap, TrendingDown } from 'lucide-react';

interface Props {
  hospitals: any[];
}

export default function StaffingOptimization({ hospitals }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8 pb-12"
    >
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
           <div className="w-12 h-12 bg-[#005EB8] flex items-center justify-center rounded-lg shadow-blue-100 shadow-lg">
              <Users className="w-6 h-6 text-white" />
           </div>
           <div>
              <h2 className="text-xl font-bold text-slate-800">Staffing Intelligence</h2>
              <p className="text-slate-500 text-xs font-medium">Resource allocation and capacity balancing</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">FTE Deficit</p>
              <p className="text-xl font-bold text-red-500">-214</p>
           </div>
           <div className="h-8 w-px bg-slate-100" />
           <div className="p-2.5 bg-red-50 text-red-500 rounded-lg">
             <AlertCircle className="w-5 h-5" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm">
               <h3 className="text-lg font-bold mb-8">Workload Intensity by Hospital</h3>
               <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={hospitals.slice(0, 8)}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700}} height={60} interval={0} angle={-30} textAnchor="end" />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: '#F0F4F8'}} />
                        <Bar dataKey="utilization" fill="#005EB8" radius={[4, 4, 0, 0]} name="Util %" />
                        <Bar dataKey="staffingLevel" fill="#768692" radius={[4, 4, 0, 0]} name="Staff Level %" />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </section>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-xl border border-slate-100 flex items-center gap-6 shadow-sm">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                     <Heart className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Burnout Risk</p>
                     <p className="text-xl font-bold text-slate-800">74.2% <span className="text-[10px] font-black text-orange-600 uppercase ml-2 tracking-tighter">High</span></p>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-xl border border-slate-100 flex items-center gap-6 shadow-sm">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                     <Zap className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Efficacy Rate</p>
                     <p className="text-xl font-bold text-slate-800">81.0% <span className="text-[10px] font-black text-blue-500 uppercase ml-2 tracking-tighter">Target</span></p>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <section className="bg-[#002F5C] text-white p-8 rounded-xl border border-blue-900 shadow-xl flex flex-col relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <BrainCircuit className="w-24 h-24" />
               </div>
               <h3 className="font-bold text-sm uppercase tracking-widest text-blue-200 mb-6">Staffing Intelligence</h3>
               <div className="space-y-4 mb-8 relative">
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-1">Recommendation 01</p>
                     <p className="text-sm leading-relaxed">Transition 12 Radiologists from Admin to Clinical backlog reporting. Estimated impact: -14% wait times.</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-1">Recommendation 02</p>
                     <p className="text-sm leading-relaxed">Implement 'Smart Shift' rotation for Lab Technicians at Addenbrooke's to reduce overtime fatigue.</p>
                  </div>
               </div>
               <button className="w-full py-3 bg-white text-[#005EB8] font-bold rounded-xl hover:bg-blue-50 transition-colors">
                  Approve Allocation Strategy
               </button>
            </section>

            <section className="bg-white p-8 rounded-xl border border-slate-100 h-full shadow-sm">
               <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                 <Stethoscope className="w-4 h-4" />
                 Skill Gap Analysis
               </h3>
               <div className="space-y-5">
                  {[
                    { skill: "Histopathology", gap: 12, trend: 'up' },
                    { skill: "MRI Operation", gap: 5, trend: 'down' },
                    { skill: "Cytology", gap: 8, trend: 'up' },
                    { skill: "Genetics Lab", gap: 15, trend: 'up' }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <span className="text-sm font-medium">{s.skill}</span>
                       <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-red-600">+{s.gap}% GAP</span>
                          {s.trend === 'up' ? <TrendingUp className="w-3 h-3 text-red-500" /> : <TrendingDown className="w-3 h-3 text-green-500" />}
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-8 pt-6 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic border-l-2 border-blue-500 pl-4 py-1">
                    "AI modelling anticipates regional workforce constraints to intensify by 4.2% if cancer referral surges sustain through July cycles."
                  </p>
               </div>
            </section>
         </div>
      </div>
    </motion.div>
  );
}

function TrendingUp(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
}
