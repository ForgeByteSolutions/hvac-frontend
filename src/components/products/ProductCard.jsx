import { Info, Leaf, Wifi } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ item, onExplain }) {
  const navigate = useNavigate();
  const { product, score } = item;
  const { specifications, features, price } = product;

  return (
    <div 
      onClick={() => navigate(`/products/${product.product_id}`)}
      className="group bg-white rounded-[24px] border border-black/[0.04] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col h-full transform hover:-translate-y-1 cursor-pointer"
    >
      
      {/* Top Graphic Placeholder / Header */}
      <div className="h-40 bg-gradient-to-br from-apple-surface to-gray-50 relative flex flex-col justify-end p-6 border-b border-black/[0.03]">
        <h3 className="text-xl font-bold text-apple-text tracking-tight">{product.brand_name}</h3>
        <p className="text-apple-gray font-medium text-sm mt-1 truncate">{product.model_name}</p>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-apple-surface/50 rounded-xl p-3">
            <div className="text-[11px] font-semibold text-apple-gray uppercase tracking-wider mb-1">Cooling</div>
            <div className="font-semibold text-apple-text">{specifications?.cooling_capacity_btu?.toLocaleString()} BTU</div>
          </div>
          <div className="bg-apple-surface/50 rounded-xl p-3">
            <div className="text-[11px] font-semibold text-apple-gray uppercase tracking-wider mb-1">Efficiency</div>
            <div className="font-semibold text-apple-text">{specifications?.seer_rating} SEER</div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {features?.smart_thermostat_compatible && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 text-apple-blue font-medium text-[12px]">
              <Wifi size={14} /> Smart Control
            </div>
          )}
          {specifications?.energy_star_certified && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 font-medium text-[12px]">
              <Leaf size={14} /> Energy Star
            </div>
          )}
          {specifications?.noise_level_db && (
            <div className="flex items-center px-2.5 py-1.5 rounded-lg bg-gray-50 text-apple-gray font-medium text-[12px]">
              {specifications.noise_level_db} dB
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-[11px] font-semibold text-apple-gray uppercase tracking-wider mb-0.5">Est. Price Range</div>
              <div className="text-[17px] font-bold text-apple-text">
                ${price?.min?.toLocaleString()} - ${price?.max?.toLocaleString()}
              </div>
            </div>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onExplain(product);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-apple-surface text-apple-text font-medium text-[15px] hover:bg-black/5 transition-colors duration-200"
          >
            <Info size={16} /> Explain via AI
          </button>
        </div>
      </div>
    </div>
  );
}
