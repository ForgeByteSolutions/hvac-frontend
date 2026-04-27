import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Settings, Package, LogOut, Activity, Zap } from 'lucide-react';
import ThermostatDial from '../components/dashboard/ThermostatDial';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import EnergyChart from '../components/dashboard/EnergyChart';

export default function Dashboard() {
  const [purchasedSystem, setPurchasedSystem] = useState(null);
  const [unit, setUnit] = useState('F');
  const [liveWeather, setLiveWeather] = useState(null);

  useEffect(() => {
    const sys = localStorage.getItem('purchased_system');
    if (sys) {
      setPurchasedSystem(JSON.parse(sys));
    }
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto w-full mt-8 animate-in fade-in duration-500">
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-apple-text tracking-tight mb-4">Account</h2>
            
            <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-apple-surface text-apple-text font-bold transition-colors">
              <Activity size={18} /> Smart Home
            </button>
            <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-apple-surface text-apple-gray hover:text-apple-text font-medium transition-colors">
               <Package size={18} /> Device History
            </button>
            <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-apple-surface text-apple-gray hover:text-apple-text font-medium transition-colors">
              <Settings size={18} /> Settings
            </button>

            <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 text-red-500 font-medium transition-colors mt-auto lg:mt-12">
              <LogOut size={18} /> Sign Out
            </button>
          </div>

          {/* Main Area */}
          <div className="flex-1">
             
             {!purchasedSystem ? (
               <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm p-12 text-center h-[600px] flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-apple-surface rounded-full flex items-center justify-center mb-6">
                    <Package size={40} className="text-apple-gray" />
                  </div>
                  <h3 className="text-3xl font-bold text-apple-text mb-4">No Systems Connected</h3>
                  <p className="text-apple-gray text-[16px] max-w-md mx-auto mb-8">
                    When you purchase a smart HVAC system, your live energy command center will unlock here.
                  </p>
                  <Link to="/products" className="px-8 py-3.5 bg-apple-blue font-semibold text-white rounded-full hover:bg-apple-blue-hover transition-colors">
                    Shop Systems
                  </Link>
               </div>
             ) : (
               <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-700">
                  
                  {/* Greeting & Quick Stats */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2">
                    <div>
                      <h3 className="text-3xl font-bold text-apple-text tracking-tight mb-2">Command Center</h3>
                      <p className="text-apple-gray font-medium flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse border border-white"></span>
                        Connected to • {purchasedSystem.brand_name} {purchasedSystem.model_name}
                      </p>
                    </div>
                  </div>

                  {/* Top Widgets: Dial & Weather */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ThermostatDial unit={unit} onToggleUnit={() => setUnit(u => u === 'F' ? 'C' : 'F')} liveWeather={liveWeather} />
                    <div className="flex flex-col gap-8">
                       <WeatherWidget unit={unit} onWeatherLoaded={setLiveWeather} />
                       <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm p-8 flex-1 flex flex-col justify-center relative overflow-hidden group hover:shadow-md transition-shadow">
                          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-colors" />
                          <div className="flex items-start gap-5 mb-3 relative z-10">
                            <div className="p-3 bg-green-100 text-green-600 rounded-2xl shrink-0"><Zap size={24} /></div>
                            <div>
                               <p className="text-[12px] font-bold text-apple-gray uppercase tracking-wider mb-1">Efficiency Rating</p>
                               <h4 className="text-3xl font-bold text-apple-text">{purchasedSystem.specifications?.seer_rating || 18} SEER</h4>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-apple-gray mt-2 relative z-10">Running at peak efficiency based on current weather conditions compared to baseline models.</p>
                       </div>
                    </div>
                  </div>

                  {/* Energy Savings Chart */}
                  <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm p-8 md:p-10 mb-12">
                     <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                       <div>
                         <h4 className="text-2xl font-bold text-apple-text mb-2">Projected Energy Savings</h4>
                         <p className="text-[14px] font-medium text-apple-gray max-w-lg">
                           Cumulative dollars saved when replacing an outdated 14-SEER system with your new {purchasedSystem.brand_name} unit.
                         </p>
                       </div>
                       <div className="mt-4 sm:mt-0 text-left sm:text-right bg-green-50 px-5 py-3 rounded-2xl">
                         <p className="text-[12px] font-bold text-green-800 uppercase tracking-wider mb-1">10-Year Total</p>
                         <p className="text-2xl font-bold text-green-600">
                           + ${Math.round((1200 - (1200 * 14 / (purchasedSystem.specifications?.seer_rating || 18))) * 10).toLocaleString()}
                         </p>
                       </div>
                     </div>
                     <EnergyChart systemSEER={purchasedSystem.specifications?.seer_rating || 18} />
                  </div>

               </div>
             )}

          </div>

        </div>

      </div>
    </Layout>
  );
}
