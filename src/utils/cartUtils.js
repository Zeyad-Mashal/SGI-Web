// Cart utility functions for managing cart in localStorage

// Get cart from localStorage
export const getCart = () => {
    if (typeof window === 'undefined') return [];
    try {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error getting cart from localStorage:', error);
        return [];
    }
};

// Save cart to localStorage
export const saveCart = (cart) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
};

// Add item to cart
export const addToCart = (product, quantity = 1) => {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(item => item._id === product._id);

    if (existingItemIndex > -1) {
        // If product already exists with same pricing mode, update quantity
        // Otherwise, add as new item (different pricing mode)
        const existingItem = cart[existingItemIndex];
        if (existingItem.isBoxPricing === product.isBoxPricing && 
            existingItem.piecesPerBox === product.piecesPerBox) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Different pricing mode, add as separate item
            cart.push({
                _id: product._id,
                name: product.name,
                price: product.price,
                picUrls: product.picUrls || [],
                quantity: quantity,
                description: product.description || '',
                categories: product.categories || [],
                sku: product.sku || product.SKU || product._id,
                isBoxPricing: product.isBoxPricing || false,
                piecesPerBox: product.piecesPerBox || undefined
            });
        }
    } else {
        // Add new product to cart
        cart.push({
            _id: product._id,
            name: product.name,
            price: product.price,
            picUrls: product.picUrls || [],
            quantity: quantity,
            description: product.description || '',
            categories: product.categories || [],
            sku: product.sku || product.SKU || product._id,
            isBoxPricing: product.isBoxPricing || false,
            piecesPerBox: product.piecesPerBox || undefined
        });
    }

    saveCart(cart);
    return cart;
};

// Remove item from cart
export const removeFromCart = (productId) => {
    const cart = getCart();
    const updatedCart = cart.filter(item => item._id !== productId);
    saveCart(updatedCart);
    return updatedCart;
};

// Update item quantity in cart
export const updateCartItemQuantity = (productId, quantity) => {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item._id === productId);

    if (itemIndex > -1) {
        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            return removeFromCart(productId);
        }
        cart[itemIndex].quantity = quantity;
        saveCart(cart);
    }

    return cart;
};

// Clear entire cart
export const clearCart = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('cart');
    return [];
};

// Get cart total items count
export const getCartItemCount = () => {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
};

// Get cart total price
export const getCartTotal = () => {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

