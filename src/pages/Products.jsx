import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/products/ProductCard';
import ProductSpecsModal from '../components/products/ProductSpecsModal';
import { HvacAPI } from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category') || '';

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const filters = categoryParam ? { category: categoryParam } : {};
        const data = await HvacAPI.getProducts(filters);
        if (isMounted) {
          setProducts(data.products || []);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch catalog", err);
        if (isMounted) setIsLoading(false);
      }
    };
    fetchCatalog();
    return () => { isMounted = false; };
  }, [categoryParam]);

  return (
    <Layout>
      <div className="w-full flex-col mt-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-apple-text tracking-tight mb-2">
              {categoryParam ? `Browse: ${categoryParam}` : "All Systems"}
            </h1>
            <p className="text-apple-gray text-lg font-medium">Find the perfect climate solution.</p>
          </div>

          {/* Simple Tab Filters syncing with URL */}
          <div className="flex gap-2">
            <button
              onClick={() => setSearchParams({})}
              className={`px-5 py-2.5 rounded-full text-[14px] font-medium transition-colors ${!categoryParam ? 'bg-apple-text text-white' : 'bg-apple-surface text-apple-gray hover:text-apple-text'}`}
            >
              All
            </button>
            <button
              onClick={() => setSearchParams({ category: 'Residential HVAC' })}
              className={`px-5 py-2.5 rounded-full text-[14px] font-medium transition-colors ${categoryParam.includes('Residential') ? 'bg-apple-text text-white' : 'bg-apple-surface text-apple-gray hover:text-apple-text'}`}
            >
              Residential
            </button>
            <button
              onClick={() => setSearchParams({ category: 'Supplies' })}
              className={`px-5 py-2.5 rounded-full text-[14px] font-medium transition-colors ${categoryParam.includes('Supplies') ? 'bg-apple-text text-white' : 'bg-apple-surface text-apple-gray hover:text-apple-text'}`}
            >
              Supplies
            </button>
            <button
              onClick={() => setSearchParams({ category: 'Specialized Equipment' })}
              className={`px-5 py-2.5 rounded-full text-[14px] font-medium transition-colors ${categoryParam.includes('Specialized') ? 'bg-apple-text text-white' : 'bg-apple-surface text-apple-gray hover:text-apple-text'}`}
            >
              Specialized
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="w-full flex justify-center py-32">
            <div className="w-10 h-10 rounded-full border-4 border-apple-surface border-t-apple-blue animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {products.map((p, idx) => (
              <div key={p.product_id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-in fade-in fill-mode-both relative group">
                <Link to={`/products/${p.product_id}`} className="absolute inset-0 z-10" aria-label={`View ${p.brand_name} ${p.model_name}`} />
                <div className="relative pointer-events-none">
                  {/* We wrap the product to match the card props, ignoring the explain button for now as we have a PDP */}
                  <ProductCard item={{ product: p, score: '-' }} onExplain={() => { }} />
                </div>
                {/* Keep Explain AI clickable above the link */}
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedProduct(p); }}
                  className="absolute bottom-6 left-6 right-6 z-20 py-3 rounded-xl bg-apple-surface/80 backdrop-blur text-apple-text font-medium text-[15px] hover:bg-black/5 transition-colors opacity-0 group-hover:opacity-100"
                >
                  Quick Explain via AI
                </button>
              </div>
            ))}
          </div>
        )}
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
