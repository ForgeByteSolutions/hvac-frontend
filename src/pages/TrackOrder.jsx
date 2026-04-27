import Layout from '../components/layout/Layout';
import { Package, MapPin, Search, CheckCircle2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function TrackOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(orderId || '');

  const steps = [
    { label: "Order Placed", date: "Oct 24", completed: true },
    { label: "Processing", date: "Oct 25", completed: true },
    { label: "Shipped", date: "Oct 26", completed: true },
    { label: "Out for Delivery", date: "Est. Oct 28", completed: false },
    { label: "Delivered", date: "", completed: false },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/track/${search}`);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto w-full mt-8 flex flex-col items-center animate-in fade-in duration-500">
        
        <div className="w-16 h-16 bg-apple-surface rounded-3xl flex items-center justify-center mb-6 text-apple-blue">
           <Package size={32} />
        </div>
        <h1 className="text-4xl font-bold text-apple-text tracking-tight mb-2 text-center">Track your delivery.</h1>
        <p className="text-apple-gray mb-10 text-center font-medium">Follow your HVAC system from our warehouse to your door.</p>

        <form onSubmit={handleSearch} className="w-full max-w-lg mb-12 relative">
           <input 
             type="text" 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             placeholder="Enter Order Number (e.g. ORD-123)"
             className="w-full bg-white border border-black/5 shadow-sm rounded-full px-6 py-4 text-[15px] outline-none focus:ring-2 focus:ring-apple-blue"
           />
           <button type="submit" className="absolute right-2 top-2 bottom-2 bg-apple-blue text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-apple-blue-hover transition-colors">
             <Search size={18} />
           </button>
        </form>

        {orderId && (
          <div className="w-full bg-white border border-black/5 shadow-lg shadow-black/5 rounded-[2rem] p-8 md:p-12">
             <div className="flex justify-between items-start mb-12 border-b border-black/5 pb-8">
                <div>
                   <p className="text-[13px] font-bold text-apple-gray uppercase tracking-wider mb-1">Order Number</p>
                   <p className="text-xl font-bold text-apple-text">{orderId}</p>
                </div>
                <div className="text-right">
                   <p className="text-[13px] font-bold text-apple-gray uppercase tracking-wider mb-1">Status</p>
                   <p className="text-xl font-bold text-apple-blue">In Transit</p>
                </div>
             </div>

             {/* Apple-style Timeline */}
             <div className="relative">
                <div className="absolute top-4 left-4 right-4 h-1 bg-apple-surface rounded-full z-0" />
                <div className="absolute top-4 left-4 w-[50%] h-1 bg-green-500 rounded-full z-0" />
                
                <div className="flex justify-between relative z-10">
                  {steps.map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                       <div className={`w-9 h-9 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${step.completed ? 'bg-green-500 text-white' : 'bg-apple-surface text-apple-gray'}`}>
                          {step.completed ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-apple-gray" />}
                       </div>
                       <div className="text-center">
                         <div className={`text-[13px] font-bold ${step.completed ? 'text-apple-text' : 'text-apple-gray'}`}>{step.label}</div>
                         <div className="text-[12px] font-medium text-apple-gray mt-0.5">{step.date}</div>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
             
             <div className="mt-12 pt-8 border-t border-black/5 flex items-center gap-4 text-apple-gray">
                <div className="p-3 bg-apple-surface rounded-full"><MapPin size={20} /></div>
                <div>
                  <p className="text-[13px] font-bold text-apple-text">Delivery Address</p>
                  <p className="text-[14px]">123 Apple Park Way, Austin, TX 78727</p>
                </div>
             </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
