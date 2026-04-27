import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("hvac_cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("hvac_cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prev) => {
            const productId = product.product_id;
            const existing = prev.find((item) => item.product_id === productId);
            if (existing) {
                return prev.map((item) =>
                    item.product_id === productId ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item.product_id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.product_id === productId) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    // HVAC products use price.min for the base price estimation, supplies might use price.unit
    const totalPrice = cart.reduce((sum, item) => {
        const p = item.price?.min || item.price?.unit || (typeof item.price === 'number' ? item.price : 0);
        return sum + p * item.quantity;
    }, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
