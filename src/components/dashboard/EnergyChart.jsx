import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function EnergyChart({ systemSEER }) {
  const SEER = parseInt(systemSEER) || 14;
  const baselineCost = 1200; // Legacy 14 SEER system baseline cost
  const newCost = baselineCost * (14 / SEER);
  const annualSavings = baselineCost - newCost;

  const data = Array.from({ length: 11 }, (_, i) => ({
    year: i === 0 ? 'Now' : `Year ${i}`,
    savings: Math.round(annualSavings * i)
  }));

  return (
    <div className="w-full h-72 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34c759" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#34c759" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="year" stroke="#86868b" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#86868b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
            formatter={(value) => [`$${value}`, 'Cumulative Savings']}
          />
          <Area 
            type="monotone" 
            dataKey="savings" 
            stroke="#34c759" 
            strokeWidth={4} 
            fillOpacity={1} 
            fill="url(#colorSavings)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
