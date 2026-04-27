import { useState, useEffect } from 'react';
import { Power, Flame, Snowflake } from 'lucide-react';

export default function ThermostatDial({ unit = 'F', onToggleUnit, liveWeather }) {
  const [temp, setTemp] = useState(72);
  const [mode, setMode] = useState('cool'); // 'cool', 'heat'
  const [isOn, setIsOn] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Convert temperature when unit changes
  useEffect(() => {
    if (unit === 'C' && temp > 40) setTemp(Math.round((temp - 32) * 5/9));
    if (unit === 'F' && temp <= 40) setTemp(Math.round((temp * 9/5) + 32));
  }, [unit]);

  // Smart Initialization Logic based on outside weather
  useEffect(() => {
    if (liveWeather && !hasInitialized) {
       const outsideC = liveWeather.temperature;
       
       if (outsideC < 18) { // Cold outside (< 64F)
          setMode('heat');
          setTemp(unit === 'F' ? 70 : 21);
          setIsOn(true);
       } else if (outsideC > 24) { // Hot outside (> 75F)
          setMode('cool');
          setTemp(unit === 'F' ? 72 : 22);
          setIsOn(true);
       } else { // Perfect outside
          setIsOn(false); // Eco/Off mode
       }
       setHasInitialized(true);
    }
  }, [liveWeather, hasInitialized, unit]);

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  
  const minTemp = unit === 'F' ? 60 : 15;
  const maxTemp = unit === 'F' ? 85 : 29;
  const percentage = Math.min(1, Math.max(0, (temp - minTemp) / (maxTemp - minTemp)));
  const strokeDashoffset = circumference - (percentage * circumference * 0.75);

  return (
    <div className="flex flex-col items-center justify-center bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-lg shadow-black/5 hover:shadow-xl transition-shadow duration-500 relative overflow-hidden group">
      
      {/* Decorative Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full blur-[80px] opacity-20 transition-colors duration-1000 point-events-none"
        style={{ backgroundColor: !isOn ? 'transparent' : mode === 'cool' ? '#0066cc' : '#ff3b30' }}
      />

      <div className="relative w-64 h-64 flex items-center justify-center">
        
        <svg className="absolute inset-0 w-full h-full drop-shadow-sm" style={{ transform: 'rotate(135deg)' }} viewBox="0 0 260 260">
          {/* Background Track */}
          <circle 
            cx="130" cy="130" r={radius} 
            stroke="#f5f5f7" strokeWidth="22" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />
          
          {/* Active Dial */}
          {isOn && (
            <circle 
              cx="130" cy="130" r={radius} 
              stroke={mode === 'cool' ? '#0066cc' : '#ff3b30'} 
              strokeWidth="22" fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            />
          )}
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] font-bold text-apple-gray uppercase tracking-widest">{isOn ? "Inside" : "System Off"}</span>
          <div className="flex items-start mt-1 mb-2">
             <span className={`text-[72px] font-bold tracking-tighter leading-none ${isOn ? "text-apple-text" : "text-apple-gray/30"} transition-colors duration-500`}>{temp}</span>
             <button 
               onClick={onToggleUnit}
               className="text-3xl font-semibold text-apple-gray mt-2 hover:text-apple-blue transition-colors cursor-pointer"
             >
               °{unit}
             </button>
          </div>
          <span className={`text-[13px] font-semibold transition-colors duration-500 ${!isOn ? 'text-apple-gray/50' : mode === 'cool' ? 'text-apple-blue' : 'text-red-500'}`}>
            {isOn ? (mode === 'cool' ? 'Cooling to' : 'Heating to') : 'Idle'}
          </span>
        </div>
      </div>

      {/* Manual Controls */}
      <div className="flex items-center justify-between w-full mt-6 px-2 relative z-10">
        <button 
          onClick={() => { if(isOn) setTemp(Math.max(minTemp, temp - 1)); }} 
          className="w-12 h-12 rounded-full bg-apple-surface flex items-center justify-center text-2xl font-bold hover:bg-black/5 active:scale-90 transition-all text-apple-text disabled:opacity-50"
          disabled={!isOn}
        >
          -
        </button>
        
        <div className="flex bg-apple-surface rounded-full p-1.5 shadow-inner">
          <button onClick={() => setIsOn(!isOn)} className={`p-2.5 rounded-full transition-all ${!isOn ? 'bg-white shadow-sm text-apple-text scale-105' : 'text-apple-gray hover:text-apple-text'}`}>
            <Power size={18} />
          </button>
          <button onClick={() => {setMode('cool'); setIsOn(true);}} className={`p-2.5 rounded-full transition-all ${isOn && mode === 'cool' ? 'bg-white shadow-sm text-apple-blue scale-105' : 'text-apple-gray hover:text-apple-blue'}`}>
            <Snowflake size={18} />
          </button>
          <button onClick={() => {setMode('heat'); setIsOn(true);}} className={`p-2.5 rounded-full transition-all ${isOn && mode === 'heat' ? 'bg-white shadow-sm text-red-500 scale-105' : 'text-apple-gray hover:text-red-500'}`}>
            <Flame size={18} />
          </button>
        </div>

        <button 
          onClick={() => { if(isOn) setTemp(Math.min(maxTemp, temp + 1)); }} 
          className="w-12 h-12 rounded-full bg-apple-surface flex items-center justify-center text-2xl font-bold hover:bg-black/5 active:scale-90 transition-all text-apple-text disabled:opacity-50"
          disabled={!isOn}
        >
          +
        </button>
      </div>
    </div>
  );
}
