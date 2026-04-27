import { useState, useRef, useEffect } from 'react';
import { Bot, X, Sparkles, RefreshCw } from 'lucide-react';
import AgentChatUI from './AgentChatUI';
import { useChatContext } from '../../context/ChatContext';
import ProductGrid from '../products/ProductGrid';
import ProductSpecsModal from '../products/ProductSpecsModal';

export default function AgentWidget() {
  const { recommendations, resetChat, isWidgetOpen: isOpen, setIsWidgetOpen: setIsOpen } = useChatContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectedProduct) return; // Do not close if modal is opened
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, selectedProduct]);

  return (
    <>
      <div ref={widgetRef}>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 ${
          isOpen ? 'bg-apple-surface text-apple-gray scale-90 shadow-sm' : ''
        }`}
        style={!isOpen ? {
          background: 'linear-gradient(135deg, #0066cc 0%, #0044aa 100%)',
          color: 'white'
        } : {}}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      {/* Floating Popover Content */}
      <div 
        className={`fixed bottom-6 right-22 w-[380px] h-[600px] max-h-[calc(100vh-120px)] max-w-[calc(100vw-32px)] z-[70] bg-white rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-black/5 origin-bottom-right transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col overflow-hidden ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 pointer-events-none translate-y-10'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/5 bg-white shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-apple-blue/10 text-apple-blue rounded-[14px]">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-apple-text tracking-tight text-[15px]">Aura AI</h3>
              <p className="text-[12px] text-apple-gray font-medium">HVAC Expert Advisor</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={resetChat}
              className="p-1.5 text-apple-gray hover:text-apple-blue hover:bg-black/5 rounded-full transition-colors"
              title="Restart Chat"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Chat / Recommendation Area */}
        <div className="flex-1 overflow-hidden relative bg-apple-bg">
          <AgentChatUI />
        </div>
        
        {/* If recommendations exist, show them as a scrollable list inside the widget */}
        {recommendations && (
           <div className="h-2/5 shrink-0 border-t border-black/5 bg-white overflow-y-auto hide-scrollbar px-4 py-5 z-10 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
              <h4 className="text-[12px] font-bold text-apple-gray mb-3 uppercase tracking-widest text-center">Top Matches</h4>
              <div className="flex flex-col gap-3">
                {recommendations.map((item, idx) => (
                  <div 
                    key={item.product?.product_id || idx} 
                    className="bg-apple-surface/50 p-3.5 rounded-[1.25rem] border border-black/5 flex flex-col gap-2 hover:bg-apple-surface transition-colors"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                         <div className="font-bold text-apple-text text-[14px] leading-tight">{item.product.brand_name}</div>
                         <div className="text-apple-gray text-[12px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">{item.product.model_name}</div>
                      </div>
                      <span className="text-[11px] font-bold text-apple-blue bg-white border border-black/5 px-2 py-0.5 rounded-md shadow-sm shrink-0">
                        {item.score}% Fit
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-[13px] font-bold text-apple-text">
                        ${item.product.price?.min} - ${item.product.price?.max}
                      </div>
                      <button 
                        onClick={() => setSelectedProduct(item.product)}
                        className="text-[12px] font-semibold text-apple-blue hover:underline"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}
      </div>
      </div>

      {/* Modal for product details triggered from inside the widget */}
      {selectedProduct && (
        <ProductSpecsModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </>
  );
}
