import { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { HvacAPI } from '../../services/api';

export default function ProductSpecsModal({ product, onClose }) {
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchExplanation = async () => {
      try {
        const response = await HvacAPI.explainBrowse(product);
        if (isMounted) {
          setExplanation(response.explanation);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setExplanation("We couldn't generate an explanation at this time. Please see the specs on the card.");
          setIsLoading(false);
        }
      }
    };

    fetchExplanation();
    return () => { isMounted = false; };
  }, [product]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 mb-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-2xl border border-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 animate-in slide-in-from-bottom-8 duration-500 overflow-hidden">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors text-apple-gray"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-apple-blue" size={20} />
            <h2 className="text-2xl font-bold text-apple-text tracking-tight">AI Analysis</h2>
          </div>
          <p className="text-apple-gray font-medium">{product.brand_name} {product.model_name}</p>
        </div>

        <div className="prose prose-apple max-w-none text-apple-text text-[15px] leading-relaxed">
          {isLoading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="h-4 bg-black/5 rounded w-3/4"></div>
              <div className="h-4 bg-black/5 rounded w-1/2"></div>
              <div className="h-4 bg-black/5 rounded w-5/6"></div>
              <div className="h-4 bg-black/5 rounded w-2/3"></div>
            </div>
          ) : (
            <div 
              className="text-apple-text space-y-4 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: explanation.replace(/\n\*/g, '<br/>•').replace(/\*\*/g, '<b>').replace(/<\/b><b>/g, '') }}
            />
          )}
        </div>
        
        <div className="mt-10 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-apple-blue text-white font-medium hover:bg-apple-blue-hover transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
