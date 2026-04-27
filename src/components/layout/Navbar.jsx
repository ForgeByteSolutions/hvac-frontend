import { Wind, ShoppingBag, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-apple-blue text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform duration-300">
            <Wind size={20} />
          </div>
          <span className="font-semibold tracking-tight text-[17px]">
            Aura<span className="text-apple-gray">HVAC</span>
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8 text-[14px] font-medium transition-colors">
          <Link to="/" className="text-apple-text hover:text-apple-blue duration-200">Home</Link>
          <Link to="/products" className="text-apple-text hover:text-apple-blue duration-200">Systems</Link>
          <Link to="/products?category=supplies" className="text-apple-gray hover:text-apple-text duration-200">Supplies</Link>
          <Link to="/track" className="text-apple-gray hover:text-apple-text duration-200">Track Order</Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-apple-gray hover:text-apple-text transition-colors duration-200">
            <User size={20} />
          </Link>

          <Link to="/cart" className="relative text-apple-text hover:text-apple-blue transition-colors duration-200">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-apple-blue text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

      </div>
    </nav>
  );
}
