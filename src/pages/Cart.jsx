import { Link } from 'react-router-dom';
import { Trash2, ShieldCheck } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { useEffect } from 'react';
import { HvacAPI } from '../services/api';
import { useChatContext } from '../context/ChatContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { setConversation, setIsWidgetOpen } = useChatContext();

  useEffect(() => {
    if (cart.length > 0) {
      const hasUpselled = sessionStorage.getItem('has_seen_upsell');
      if (!hasUpselled) {
        sessionStorage.setItem('has_seen_upsell', 'true');
        HvacAPI.analyzeCart(cart).then((res) => {
          if (res.upsell_available) {
             setConversation(prev => {
                // Ensure we don't accidentally double-push if strict mode races
                if (prev.some(m => m.suggested_product?.product_id === res.suggested_product.product_id)) return prev;
                return [
                  ...prev, 
                  { role: 'assistant', content: res.message, suggested_product: res.suggested_product }
                ];
             });
             setIsWidgetOpen(true);
          }
        }).catch(err => console.error("Upsell error", err));
      }
    }
  }, [cart, setConversation, setIsWidgetOpen]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto w-full mt-8 animate-in fade-in duration-500">
        <h1 className="text-4xl font-bold text-apple-text tracking-tight mb-8">Review your bag.</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 px-6 border-y border-black/5 mt-12 bg-white rounded-3xl">
            <p className="text-2xl font-semibold mb-6">Your bag is empty.</p>
            <Link to="/products" className="px-6 py-3 bg-apple-surface text-apple-text font-medium rounded-full hover:bg-black/5 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            
            <div className="bg-white rounded-[2rem] p-6 md:p-10 border border-black/5 shadow-sm">
              <ul className="divide-y divide-black/5">
                {cart.map((item) => (
                  <li key={item.product_id} className="py-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                    
                    <div className="w-24 h-24 bg-apple-surface rounded-2xl shrink-0 flex items-center justify-center font-bold text-black/10 text-xl tracking-tighter">
                      HVAC
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between mb-2">
                        <h3 className="text-xl font-bold text-apple-text">{item.model_name}</h3>
                        <p className="text-xl font-bold text-apple-text md:ml-4 mt-2 md:mt-0">
                          ${((item.price?.min || item.price?.unit || (typeof item.price === 'number' ? item.price : 0)) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-[15px] font-medium text-apple-gray mb-6">{item.brand_name} • {item.product_type}</p>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 bg-apple-surface rounded-full px-4 py-1.5 w-max">
                          <button 
                            onClick={() => updateQuantity(item.product_id, -1)}
                            className="text-apple-gray hover:text-apple-text text-xl"
                          >-</button>
                          <span className="font-semibold text-[15px] w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product_id, 1)}
                            className="text-apple-gray hover:text-apple-text text-xl"
                          >+</button>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-apple-blue hover:text-apple-blue-hover font-medium text-[14px] flex items-center gap-1.5"
                        >
                           Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-[2rem] p-6 md:p-10 border border-black/5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
               
               <div className="flex items-center gap-4 text-apple-gray text-[14px] font-medium max-w-sm">
                 <ShieldCheck size={32} className="shrink-0 text-apple-blue" />
                 All systems come with a 10-year AuraHVAC manufacturer warranty securely logged at checkout.
               </div>

               <div className="w-full md:w-auto">
                 <div className="flex justify-between md:justify-end gap-12 text-xl font-bold mb-6">
                   <span>Subtotal</span>
                   <span>${totalPrice.toLocaleString()}</span>
                 </div>
                 <Link 
                   to="/checkout" 
                   className="block w-full text-center px-10 py-4 rounded-full bg-apple-blue text-white font-semibold text-[17px] hover:bg-apple-blue-hover transition-colors"
                 >
                   Check Out
                 </Link>
               </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}
