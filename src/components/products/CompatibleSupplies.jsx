import { useNavigate } from 'react-router-dom';

export default function CompatibleSupplies({ supplies }) {
  const navigate = useNavigate();

  if (!supplies || supplies.length === 0) return null;

  return (
    <div className="mt-20">
      <h2 className="text-2xl font-bold text-apple-text mb-8">Compatible Accessories & Supplies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {supplies.map((supply) => (
          <div 
            key={supply.product_id}
            onClick={() => {
              navigate(`/products/${supply.product_id}`);
              window.scrollTo(0, 0);
            }}
            className="group p-6 bg-white border border-black/5 rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col h-full"
          >
            <div className="mb-4">
              <span className="text-[11px] font-bold text-apple-blue bg-apple-blue/10 px-3 py-1.5 rounded-full uppercase tracking-wider">{supply.category}</span>
            </div>
            <h3 className="text-[17px] font-bold text-apple-text group-hover:text-apple-blue transition-colors mb-2 leading-tight">{supply.brand_name} {supply.model_name}</h3>
            <p className="text-[14px] text-apple-gray flex-grow mb-6 line-clamp-2">{supply.notes || supply.product_type}</p>
            
            <div className="flex items-end justify-between mt-auto pt-4 border-t border-black/5">
              <div>
                <div className="text-[11px] font-semibold text-apple-gray uppercase tracking-wider mb-0.5">Est. Price Range</div>
                <div className="text-[16px] font-bold text-apple-text">
                  ${(supply.price?.min || supply.price?.unit || (typeof supply.price === 'number' ? supply.price : 0)).toLocaleString()}
                  {supply.price?.max && ` - $${supply.price?.max?.toLocaleString()}`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
