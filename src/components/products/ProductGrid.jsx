import ProductCard from './ProductCard';
import { useChatContext } from '../../context/ChatContext';

export default function ProductGrid({ onExplain }) {
  const { recommendations, parsedRequirements } = useChatContext();

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Requirement Summary Tag */}
      {parsedRequirements && (
        <div className="mb-8 p-6 bg-white border border-black/5 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <h3 className="text-lg font-bold text-apple-text mb-3">Your Personalized Selection</h3>
          <div className="flex flex-wrap gap-2 text-[14px]">
            {parsedRequirements.coverage_sq_ft && (
              <span className="bg-apple-surface px-3 py-1.5 rounded-lg text-apple-text font-medium">
                {parsedRequirements.coverage_sq_ft} sq ft
              </span>
            )}
            {parsedRequirements.climate_zone && (
              <span className="bg-apple-surface px-3 py-1.5 rounded-lg text-apple-text font-medium">
                {parsedRequirements.climate_zone} Climate
              </span>
            )}
            {parsedRequirements.budget_max && (
              <span className="bg-apple-surface px-3 py-1.5 rounded-lg text-apple-text font-medium">
                Under ${parsedRequirements.budget_max}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((item, idx) => (
          <div key={item.product?.product_id || idx} style={{ animationDelay: `${idx * 100}ms` }} className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both">
            <ProductCard item={item} onExplain={onExplain} />
          </div>
        ))}
      </div>
    </div>
  );
}
