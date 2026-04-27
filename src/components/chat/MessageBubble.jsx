import { Sparkles, User, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
     if (message.suggested_product) {
        addToCart(message.suggested_product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
     }
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${isUser ? 'bg-apple-surface text-apple-gray' : 'bg-apple-blue text-white shadow-md'}`}>
          {isUser ? <User size={16} /> : <Sparkles size={16} />}
        </div>

        {/* Bubble */}
        <div className={`px-5 py-3.5 text-[15px] leading-relaxed relative ${
          isUser 
            ? 'bg-apple-blue text-white rounded-2xl rounded-tr-sm shadow-sm' 
            : 'bg-white border border-black/5 text-apple-text rounded-2xl rounded-tl-sm shadow-sm'
        }`}>
          {message.content && <div>{message.content}</div>}

          {message.suggested_product && !isUser && (
             <div className={message.content ? "mt-4 pt-4 border-t border-black/5" : ""}>
                <div className="flex items-center justify-between gap-4">
                   <div>
                      <div className="text-[13px] font-bold text-apple-text block leading-tight">{message.suggested_product.brand_name} {message.suggested_product.model_name}</div>
                      <div className="text-[12px] text-apple-gray font-medium mt-0.5">
                        +${(message.suggested_product.price?.min || message.suggested_product.price?.unit || (typeof message.suggested_product.price === 'number' ? message.suggested_product.price : 0)).toLocaleString()}
                      </div>
                   </div>
                   <button
                     onClick={handleAdd}
                     className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 transition-colors ${
                       added ? 'bg-green-500 text-white' : 'bg-apple-blue text-white hover:bg-apple-blue-hover'
                     }`}
                   >
                     {added ? <><CheckCircle2 size={14} /> Added</> : <><ShoppingBag size={14} /> Add</>}
                   </button>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex w-full justify-start animate-in fade-in duration-300">
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-apple-blue text-white shadow-md flex items-center justify-center mt-1">
          <Sparkles size={16} />
        </div>
        <div className="bg-white border border-black/5 px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-sm">
          <div className="w-1.5 h-1.5 bg-apple-gray/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1.5 h-1.5 bg-apple-gray/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1.5 h-1.5 bg-apple-gray/50 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
