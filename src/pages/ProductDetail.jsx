import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Sparkles, CheckCircle2, Box, HardHat } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { HvacAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import CompatibleSupplies from '../components/products/CompatibleSupplies';
import { useContractorContext } from '../context/ContractorContext';
import ContractorAdvisorPanel from '../components/contractor/ContractorAdvisorPanel';

// Locally hosted .glb models in /public/models/
const MODEL_MAP = {
  'Central Air Conditioner': '/models/AirConditioner.glb',
  'Air Conditioner':         '/models/AirConditioner.glb',
  'Ductless Mini-Split':     '/models/AirConditioner.glb',
  'Heat Pump':               '/models/AirConditioner.glb',
  'Dual Fuel Heat Pump':     '/models/AirConditioner.glb',
  'Gas Furnace':             '/models/AirConditioner.glb',
  'Furnace':                 '/models/AirConditioner.glb',
  default:                   '/models/AirConditioner.glb',
};

function getModelUrl(product) {
  const type = product?.product_type || '';
  return MODEL_MAP[type] || MODEL_MAP.default;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [supplies, setSupplies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [modelError, setModelError] = useState(false);
  const { openPanelWithProduct } = useContractorContext();

  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      try {
        const data = await HvacAPI.getProduct(id);
        if (isMounted) setProduct(data);
        
        // Fetch compatible supplies
        const suppliesData = await HvacAPI.getCompatibleSupplies(id);
        if (isMounted && suppliesData.supplies) {
           setSupplies(suppliesData.supplies);
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchDetail();
    return () => { isMounted = false; };
  }, [id]);

  const handleExplain = async () => {
    setIsExplaining(true);
    try {
      const response = await HvacAPI.explainBrowse(product);
      setAiExplanation(response.explanation);
    } catch (err) {
      setAiExplanation("Unable to generate AI explanation at this time.");
    } finally {
      setIsExplaining(false);
    }
  };

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center -mt-32">
          <div className="w-10 h-10 rounded-full border-4 border-apple-surface border-t-apple-blue animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="text-center mt-32">
          <h2 className="text-2xl font-bold">Product Not Found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-5xl mx-auto mt-4 md:mt-8 animate-in fade-in duration-500">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-apple-gray hover:text-apple-text font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={18} /> Back to browsing
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left: 3D Model Viewer */}
          <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] rounded-[2rem] aspect-square flex flex-col items-center justify-center border border-white/5 relative overflow-hidden">

             {modelError ? (
               /* Fallback when .glb model file is not yet placed in /public/models/ */
               <div className="flex flex-col items-center justify-center text-center px-8 gap-5 h-full">
                 <div className="text-7xl opacity-40">📦</div>
                 <div>
                   <p className="text-white/80 font-bold text-lg mb-1">{product.brand_name}</p>
                   <p className="text-white/40 text-sm">{product.model_name}</p>
                   <p className="text-white/25 text-xs mt-4">3D model coming soon</p>
                 </div>
                 <div className="absolute bottom-4 text-[10px] text-white/20 font-mono">Place GLB in /public/models/</div>
               </div>
             ) : (
               <model-viewer
                 src={getModelUrl(product)}
                 alt={`3D preview of ${product.model_name}`}
                 auto-rotate
                 camera-controls
                 ar
                 ar-modes="webxr scene-viewer quick-look"
                 shadow-intensity="1"
                 exposure="0.9"
                 style={{ width: '100%', height: '100%', background: 'transparent' }}
                 onError={() => setModelError(true)}
               >
                 <button
                   slot="ar-button"
                   style={{
                     position: 'absolute',
                     bottom: '20px',
                     left: '50%',
                     transform: 'translateX(-50%)',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '8px',
                     background: 'rgba(255,255,255,0.95)',
                     backdropFilter: 'blur(10px)',
                     border: 'none',
                     borderRadius: '9999px',
                     padding: '10px 20px',
                     fontSize: '14px',
                     fontWeight: '600',
                     cursor: 'pointer',
                     boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                   }}
                 >
                   📱 View in Your Space
                 </button>
               </model-viewer>
             )}

             <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full pointer-events-none">
               3D Preview
             </div>
             <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none">
               <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
               AR Ready
             </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col justify-center">
            
            <div className="mb-2 flex items-center gap-2 text-[13px] font-bold tracking-widest uppercase text-apple-gray">
              <span>{product.brand_name}</span>
              <span className="w-1 h-1 rounded-full bg-black/20" />
              <span>{product.category}</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-apple-text tracking-tight leading-[1.1] mb-6">
              {product.model_name}
            </h1>
            
            <div className="text-3xl font-semibold text-apple-text mb-8">
              ${(product.price?.min || product.price?.unit || (typeof product.price === 'number' ? product.price : 0)).toLocaleString()} 
              {product.price?.max && <span className="text-xl text-apple-gray font-normal"> - ${product.price.max.toLocaleString()}</span>}
            </div>

            <button
              onClick={handleAdd}
              className={`w-full md:w-auto px-10 py-4 rounded-full font-semibold text-[17px] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${
                added ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105' : 'bg-apple-blue text-white hover:bg-apple-blue-hover hover:scale-105'
              }`}
            >
              {added ? (
                <><CheckCircle2 size={20} /> Added to Cart</>
              ) : (
                <><ShoppingBag size={20} /> Add to Cart</>
              )}
            </button>

            {/* Contractor Advisor Trigger — B2B tool, separate from consumer AI */}
            <button
              id="contractor-advisor-btn"
              onClick={() => openPanelWithProduct(product)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '12px',
                width: '100%',
                padding: '13px 20px',
                borderRadius: '14px',
                border: '1.5px solid rgba(15,23,42,0.15)',
                background: 'linear-gradient(135deg, rgba(15,23,42,0.04), rgba(30,64,175,0.04))',
                color: '#0f172a',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(15,23,42,0.08), rgba(30,64,175,0.08))';
                e.currentTarget.style.borderColor = 'rgba(30,64,175,0.3)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(15,23,42,0.04), rgba(30,64,175,0.04))';
                e.currentTarget.style.borderColor = 'rgba(15,23,42,0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{
                width: 32, height: 32, borderRadius: '9px',
                background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <HardHat size={15} color="#fff" />
              </span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: '800' }}>Contractor Advisor</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', marginTop: 1 }}>
                  AI-assisted job completion
                </div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: '700', color: '#1e40af',
                background: 'rgba(30,64,175,0.08)', padding: '3px 9px', borderRadius: '20px' }}>
                B2B
              </span>
            </button>

            <ContractorAdvisorPanel />

            {/* AI Explanation Inline */}
            <div className="mt-12 p-6 bg-apple-blue/5 rounded-3xl border border-apple-blue/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-apple-blue text-white p-2 rounded-xl"><Sparkles size={18} /></div>
                <h3 className="font-bold text-apple-text text-lg">Aura AI Analysis</h3>
              </div>
              
              {!aiExplanation && !isExplaining && (
                <button 
                  onClick={handleExplain}
                  className="px-5 py-2.5 bg-white text-apple-text font-medium text-[14px] rounded-full shadow-sm border border-black/5 hover:bg-gray-50"
                >
                  Generate plain-english specs
                </button>
              )}
              
              {isExplaining && (
                 <div className="space-y-3 animate-pulse">
                   <div className="h-3 bg-apple-blue/20 w-3/4 rounded-full" />
                   <div className="h-3 bg-apple-blue/20 w-full rounded-full" />
                   <div className="h-3 bg-apple-blue/20 w-5/6 rounded-full" />
                 </div>
              )}

              {aiExplanation && (
                <div 
                  className="prose prose-sm prose-apple max-w-none text-apple-text/80 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: aiExplanation.replace(/\n\*/g, '<br/>•').replace(/\*\*/g, '<b>').replace(/<\/b><b>/g, '') }}
                />
              )}
            </div>

          </div>
        </div>

        {/* Specs Grid */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries({...(product.specifications || {}), ...(product.coverage || {})}).slice(0, 4).map(([key, value]) => (
            <div key={key} className="p-6 bg-white border border-black/5 rounded-3xl shadow-sm">
              <div className="text-apple-gray text-[12px] font-bold uppercase tracking-wider mb-2">
                 {key.replace(/_/g, ' ')}
              </div>
              <div className="text-2xl font-semibold text-apple-text capitalize">
                 {Array.isArray(value) ? value.join(', ') : String(value)}
              </div>
            </div>
          ))}
        </div>

        {/* AR Feature Banner */}
        <div className="mt-24 rounded-[2rem] overflow-hidden bg-gradient-to-r from-[#08080f] to-[#0d1b4b] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 border border-white/5">
          <div className="flex-1">
            <p className="text-[12px] font-bold text-apple-blue uppercase tracking-widest mb-3 flex items-center gap-2">
              <Box size={14} /> Augmented Reality
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              See it in your space<br/>before you buy.
            </h3>
            <p className="text-white/60 text-[15px] leading-relaxed mb-6">
              On iPhone or Android, tap "View in Your Space" on the 3D model above to project this unit into your real environment. Check size, placement, and fit — instantly.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-white text-[13px] font-medium">
                <span>📱</span> iOS AR Quick Look
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-white text-[13px] font-medium">
                <span>🤖</span> Android WebXR
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-white text-[13px] font-medium">
                <span>🖥️</span> 360° Desktop View
              </div>
            </div>
          </div>

          {/* Mini live 3D preview in the banner */}
          <div className="w-full md:w-56 h-48 rounded-2xl overflow-hidden border border-white/10 shrink-0">
            <model-viewer
              src={getModelUrl(product)}
              alt="AR mini preview"
              auto-rotate
              camera-controls
              style={{ width: '100%', height: '100%', background: 'transparent' }}
            />
          </div>
        </div>

        {/* Compatible Supplies */}
        <CompatibleSupplies supplies={supplies} />

      </div>
    </Layout>
  );
}
