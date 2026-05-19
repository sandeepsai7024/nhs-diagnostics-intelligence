import React from 'react';
import { motion } from 'motion/react';
import { cn, formatNumber } from '../lib/utils';
import { AlertCircle, MapPin, Search } from 'lucide-react';

interface Props {
  regions: any[];
}

export default function DiagnosticMap({ regions }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">NHS England Regional Pressure Map</h2>
          <p className="text-[#768692]">Visualising diagnostic capacity and patient wait times across 7 regions</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#D8DDE0] rounded-lg text-xs font-bold">
            <div className="w-3 h-3 rounded-full bg-green-500" /> Stable
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#D8DDE0] rounded-lg text-xs font-bold">
            <div className="w-3 h-3 rounded-full bg-orange-500" /> Caution
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#D8DDE0] rounded-lg text-xs font-bold">
            <div className="w-3 h-3 rounded-full bg-red-500" /> Critical
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-8 shadow-sm h-[600px] flex items-center justify-center relative overflow-hidden">
           {/* Abstract UK Map Simulation using Shapes */}
           <div className="relative w-full h-full max-w-md mx-auto opacity-80 group">
              <svg viewBox="0 0 400 600" className="w-full h-full drop-shadow-2xl">
                 {/* Simplified UK Regions as overlapping blobs for "Simulated Map" feel */}
                 <RegionPath d="M180,50 L220,40 L260,80 L240,120 L160,110 Z" name="North East" pressure={regions[6]?.pressure} />
                 <RegionPath d="M120,100 L180,110 L200,180 L140,200 L100,150 Z" name="North West" pressure={regions[5]?.pressure} />
                 <RegionPath d="M160,180 L240,160 L280,220 L220,260 L180,240 Z" name="Midlands" pressure={regions[3]?.pressure} />
                 <RegionPath d="M240,240 L320,260 L340,340 L260,360 L220,320 Z" name="East of England" pressure={regions[4]?.pressure} />
                 <RegionPath d="M180,280 L260,300 L240,340 L160,330 Z" name="London" pressure={regions[0]?.pressure} />
                 <RegionPath d="M80,240 L160,260 L180,340 L100,360 L60,300 Z" name="South West" pressure={regions[2]?.pressure} />
                 <RegionPath d="M160,340 L260,350 L280,420 L140,440 Z" name="South East" pressure={regions[1]?.pressure} />
              </svg>
              
              {/* Region Tooltips/Overlay */}
              <div className="absolute top-10 right-0 space-y-2 pointer-events-none">
                 {regions.map((r, i) => (
                    <motion.div 
                      key={i}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/90 backdrop-blur-sm border border-slate-100 p-3 rounded-xl shadow-lg flex items-center gap-4 w-56"
                    >
                       <div className={cn(
                         "w-2 h-10 rounded-full",
                         r.pressure > 80 ? "bg-red-500" : r.pressure > 60 ? "bg-orange-500" : "bg-green-500"
                       )} />
                       <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase font-bold text-[#768692]">{r.name}</p>
                          <p className="text-sm font-bold truncate">Backlog: {formatNumber(r.backlog)}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-bold">{r.waitTimes}w</p>
                          <p className="text-[8px] uppercase text-[#768692]">Wait</p>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>
           
           <div className="absolute bottom-8 left-8 flex items-center gap-3">
              <div className="p-3 bg-[#005EB8] rounded-xl shadow-lg text-white">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#768692] uppercase">Live Surveillance</p>
                <p className="text-sm font-bold">7 Healthcare Regions | Active Sync</p>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <section className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm overflow-hidden">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                 <AlertCircle className="w-5 h-5 text-red-500" />
                 High Risk Focal Points
              </h3>
              <div className="space-y-3">
                 {regions.filter(r => r.pressure > 70).map((r, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group hover:border-blue-500 transition-all cursor-pointer">
                       <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold",
                             r.pressure > 85 ? "bg-red-500" : "bg-orange-400"
                          )}>
                             {r.name.charAt(0)}
                          </div>
                          <div>
                             <p className="font-bold text-slate-800">{r.name}</p>
                             <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Pressure: {r.pressure}%</p>
                          </div>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-blue-500" />
                    </div>
                 ))}
              </div>
           </section>

           <section className="bg-[#002F5C] rounded-xl p-6 text-white shadow-xl border border-blue-900">
             <h3 className="font-bold mb-6 text-blue-200 uppercase text-[10px] tracking-widest">Regional Mitigation Status</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-400">Staff Redistribution</span>
                   <span className="text-green-400 font-mono">ACTIVE [88%]</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-400">Equipment Load Balancing</span>
                   <span className="text-blue-400 font-mono">SYNCING [42%]</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-400">Emergency Subsidiarity</span>
                   <span className="text-orange-400 font-mono">READY [99%]</span>
                </div>
             </div>
             <button className="w-full mt-6 py-2.5 border border-gray-700 hover:bg-gray-800 rounded-lg text-xs font-bold transition-all">
                Generate Full Geographic Audit
             </button>
           </section>
        </div>
      </div>
    </motion.div>
  );
}

function RegionPath({ d, name, pressure = 0 }: any) {
  const color = pressure > 80 ? '#ef4444' : pressure > 60 ? '#f97316' : '#22c55e';
  return (
     <motion.path 
       d={d}
       fill={color}
       stroke="#fff"
       strokeWidth="2"
       initial={{ pathLength: 0, opacity: 0 }}
       animate={{ pathLength: 1, opacity: 0.3 }}
       whileHover={{ opacity: 0.8, scale: 1.02 }}
       className="transition-all cursor-pointer outline-none"
     >
       <title>{name}: {pressure}% pressure</title>
     </motion.path>
  );
}

function ChevronRight({ className }: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
  );
}
