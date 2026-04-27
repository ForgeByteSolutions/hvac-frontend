import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/products/ProductCard';
import ProductSpecsModal from '../components/products/ProductSpecsModal';
import { HvacAPI } from '../services/api';

export default function Browse() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await HvacAPI.getProducts();
        // The endpoint returns { count, products }
        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch catalog", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  return (
    <Layout>
      <div className="w-full flex-col mt-4">
        <h1 className="text-3xl font-bold text-apple-text tracking-tight mb-2">Full Catalog</h1>
        <p className="text-apple-gray mb-8">Browse all available HVAC equipment without AI guidance.</p>

        {isLoading ? (
          <div className="w-full flex justify-center py-20">
             <div className="w-8 h-8 rounded-full border-4 border-apple-surface border-t-apple-blue animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-700">
            {products.map((p, idx) => (
              <ProductCard 
                key={p.product_id}
                // Wrap the product to match the Agent output format which expects { product: {...}, score: optional }
                item={{ product: p, score: '-' }} 
                onExplain={setSelectedProduct}
              />
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
