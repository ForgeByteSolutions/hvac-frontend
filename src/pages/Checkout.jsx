import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Loader2, Lock } from 'lucide-react';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Save primary HVAC system to unlock Dashboard features
      const mainSystem = cart.find(item => item.category !== 'Supplies');
      if (mainSystem) {
         localStorage.setItem('purchased_system', JSON.stringify(mainSystem));
      }
      
      clearCart();
      
      // Redirect to tracking after 3 seconds
      setTimeout(() => {
        navigate('/dashboard'); // Go to dashboard directly to show the wow factor
      }, 3000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in zoom-in duration-500">
          <CheckCircle2 size={80} className="text-green-500 mb-6" />
          <h1 className="text-4xl font-bold text-apple-text tracking-tight mb-4">Payment Successful</h1>
          <p className="text-apple-gray text-lg mb-8">Thank you for your order. We are preparing it for shipment.</p>
          <div className="w-8 h-8 rounded-full border-4 border-apple-surface border-t-apple-blue animate-spin" />
          <p className="text-sm text-apple-gray mt-4 font-medium">Redirecting to order tracking...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto w-full mt-8 animate-in fade-in duration-500">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-apple-text tracking-tight mb-2">Checkout</h1>
          <p className="text-apple-gray font-medium flex items-center justify-center gap-2">
            <Lock size={14} /> Secure Encrypted Payment
          </p>
        </div>

        <form onSubmit={handleCheckout} className="bg-white p-8 md:p-12 rounded-[2rem] border border-black/5 shadow-xl shadow-black/5 relative overflow-hidden">
           
           <h3 className="text-xl font-bold mb-6 text-apple-text">Shipping Information</h3>
           <div className="grid grid-cols-2 gap-4 mb-8">
             <input type="text" required placeholder="First Name" className="col-span-1 bg-apple-surface border-none rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-apple-blue transition-shadow" />
             <input type="text" required placeholder="Last Name" className="col-span-1 bg-apple-surface border-none rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-apple-blue transition-shadow" />
             <input type="text" required placeholder="Address" className="col-span-2 bg-apple-surface border-none rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-apple-blue transition-shadow" />
             <input type="text" required placeholder="City" className="col-span-1 md:col-span-2 bg-apple-surface border-none rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-apple-blue transition-shadow" />
           </div>

           <h3 className="text-xl font-bold mb-6 text-apple-text border-t border-black/5 pt-8">Payment Details</h3>
           <div className="grid grid-cols-2 gap-4 mb-10">
             <input type="text" required placeholder="Card Number" className="col-span-2 bg-apple-surface border-none rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-apple-blue transition-shadow" />
             <input type="text" required placeholder="MM/YY" className="col-span-1 bg-apple-surface border-none rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-apple-blue transition-shadow" />
             <input type="text" required placeholder="CVC" className="col-span-1 bg-apple-surface border-none rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-apple-blue transition-shadow" />
           </div>

           <button 
             disabled={isProcessing || cart.length === 0}
             className="w-full bg-apple-text text-white py-4 rounded-xl font-semibold text-[17px] hover:bg-black transition-colors flex items-center justify-center gap-2"
           >
             {isProcessing ? <Loader2 size={20} className="animate-spin" /> : `Pay $${totalPrice.toLocaleString()}`}
           </button>
        </form>
      </div>
    </Layout>
  );
}
