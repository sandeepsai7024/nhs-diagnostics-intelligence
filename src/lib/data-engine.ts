export const NHS_REGIONS = [
  "London", "South East", "South West", "Midlands", "East of England", "North West", "North East & Yorkshire"
];

export const DIAGNOSTIC_TYPES = ["MRI", "CT", "Ultrasound", "Blood Tests", "Biopsy", "Histopathology"];

export const HOSPITAL_NAMES = [
  "St Thomas' Hospital", "Royal Free Hospital", "Manchester Royal Infirmary", 
  "Queen Elizabeth Hospital", "Leeds General Infirmary", "Addenbrooke's Hospital",
  "Southampton General", "Bristol Royal Infirmary"
];

export function generateSyntheticData() {
  const regions = NHS_REGIONS.map(name => {
    const pressure = Math.floor(Math.random() * 100);
    return {
      name,
      pressure, // 0-100 scale
      waitTimes: 5 + Math.floor(Math.random() * 15), // weeks
      backlog: 500 + Math.floor(Math.random() * 5000),
      status: pressure > 80 ? 'critical' : pressure > 60 ? 'warning' : 'stable'
    };
  });

  const hospitals = HOSPITAL_NAMES.map(name => ({
    id: name.toLowerCase().replace(/ /g, '-'),
    name,
    region: NHS_REGIONS[Math.floor(Math.random() * NHS_REGIONS.length)],
    utilization: 70 + Math.floor(Math.random() * 25),
    staffingLevel: 80 + Math.floor(Math.random() * 20),
    turnaroundTime: 12 + Math.floor(Math.random() * 48), // hours
    riskLevel: Math.random() > 0.8 ? 'high' : 'normal'
  }));

  const trends = Array.from({ length: 12 }).map((_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    backlog: 12000 + (Math.sin(i / 1.5) * 4000) + (Math.random() * 500),
    capacity: 10000 + (Math.random() * 1000),
    performance: 85 + (Math.cos(i / 2) * 10)
  }));

  const pathologyWorkflow = [
    { stage: "Collection", duration: 2, efficiency: 95 },
    { stage: "Transport", duration: 4, efficiency: 88 },
    { stage: "Preparation", duration: 6, efficiency: 75, bottleneck: true },
    { stage: "Analysis", duration: 12, efficiency: 92 },
    { stage: "Validation", duration: 4, efficiency: 98 },
    { stage: "Reporting", duration: 4, efficiency: 94 },
  ];

  const totalBacklog = regions.reduce((acc, curr) => acc + curr.backlog, 0);
  const avgWaitTime = regions.reduce((acc, curr) => acc + curr.waitTimes, 0) / regions.length;

  return {
    regions,
    hospitals,
    trends,
    pathologyWorkflow,
    summary: {
      totalBacklog,
      avgWaitTime: avgWaitTime.toFixed(1),
      staffingPressure: 78,
      cancerPathwayDelays: "14%",
      highRiskCount: Math.floor(totalBacklog * 0.05)
    }
  };
}
