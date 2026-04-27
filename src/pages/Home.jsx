import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Sparkles, ShieldCheck, ThermometerSun, Leaf } from 'lucide-react';
import { useChatContext } from '../context/ChatContext';
import ProductGrid from '../components/products/ProductGrid';
import ProductSpecsModal from '../components/products/ProductSpecsModal';

export default function Home() {
  const { recommendations } = useChatContext();
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <Layout>
      <div className="w-full flex flex-col items-center">

        {/* Full-width Hero Section inside the layout constraints */}
        <section className="relative w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-apple-surface to-white border border-black/5 shadow-sm mt-4 md:mt-8">

          {/* Animated decorative orbs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-60">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-apple-blue/30 blur-[100px] rounded-full animate-pulse transition-all duration-[3000ms]" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-400/20 blur-[100px] rounded-full animate-pulse transition-all duration-[4000ms]" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-200/10 blur-[120px] rounded-full animate-pulse transition-all duration-[5000ms]" style={{ animationDelay: '2s' }} />
          </div>

          <div className="relative px-8 py-20 md:py-32 flex flex-col items-center text-center max-w-4xl mx-auto z-10">
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-apple-blue/10 text-apple-blue font-semibold text-sm mb-8 animate-in fade-in slide-in-from-bottom-4">
              <Sparkles size={16} /> Powered by ForgeByte AI
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-apple-text leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-6 duration-500 delay-100 fill-mode-both">
              Your home's climate,<br />
              <span className="text-apple-blue">perfectly engineered.</span>
            </h1>

            <p className="text-xl md:text-2xl text-apple-gray font-medium max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-6 duration-500 delay-200 fill-mode-both">
              Discover high-efficiency heating and cooling systems tailored to your exact needs using our intelligent advisor.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-300 fill-mode-both mt-4">
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-1 bg-gradient-to-r from-apple-blue to-teal-400 rounded-full blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
                <Link
                  to="/products"
                  className="relative px-8 py-4 rounded-full bg-apple-text text-white font-semibold text-[17px] hover:bg-black transition-all duration-300 hover:scale-[1.02] shadow-xl flex items-center justify-center min-w-[200px]"
                >
                  Explore Systems
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* AI Recommendations Area (appears only when Agent returns recommendations) */}
        {recommendations && (
          <section className="w-full mt-16 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-apple-text tracking-tight">Your AI Matches</h2>
            </div>
            <ProductGrid onExplain={setSelectedProduct} />
          </section>
        )}

        {/* Feature Grid */}
        <section className={`w-full mb-12 ${recommendations ? 'mt-32' : 'mt-24'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group flex flex-col items-center text-center p-8 bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-blue-500/15 border border-black/5 hover:border-blue-100 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-16 h-16 bg-blue-50 text-apple-blue rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                <ThermometerSun size={28} />
              </div>
              <h3 className="relative text-xl font-bold text-apple-text mb-3">Precision Control</h3>
              <p className="relative text-apple-gray font-medium text-[15px] leading-relaxed">
                Smart thermostat compatible systems that maintain your exact preferred temperature within 1 degree.
              </p>
            </div>

            <div className="group flex flex-col items-center text-center p-8 bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-green-500/15 border border-black/5 hover:border-green-100 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                <Leaf size={28} />
              </div>
              <h3 className="relative text-xl font-bold text-apple-text mb-3">Ultra Efficient</h3>
              <p className="relative text-apple-gray font-medium text-[15px] leading-relaxed">
                Up to 26 SEER ratings meaning dramatically lower energy bills and a reduced carbon footprint.
              </p>
            </div>

            <div className="group flex flex-col items-center text-center p-8 bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-orange-500/15 border border-black/5 hover:border-orange-100 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                <ShieldCheck size={28} />
              </div>
              <h3 className="relative text-xl font-bold text-apple-text mb-3">10-Year Warranty</h3>
              <p className="relative text-apple-gray font-medium text-[15px] leading-relaxed">
                Premium reliability backed by industry-leading compressor and parts warranties.
              </p>
            </div>
          </div>
        </section>

      </div>

      {selectedProduct && (
        <ProductSpecsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </Layout>
  );
}
