// Cart utility functions for managing cart in localStorage

const getAvailableStock = (item) => {
    const rawStock = item?.stock ?? item?.quantity ?? null;
    if (rawStock === null || rawStock === undefined || rawStock === '') return null;
    const parsed = Number(rawStock);
    if (Number.isNaN(parsed) || parsed < 0) return null;
    return parsed;
};

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
    const availableStock = getAvailableStock(product);
    const normalizedQty = Math.max(1, Number(quantity) || 1);
    const qtyToAdd = availableStock == null
        ? normalizedQty
        : Math.min(normalizedQty, Math.max(0, availableStock));

    if (existingItemIndex > -1) {
        // If product already exists with same pricing mode, update quantity
        // Otherwise, add as new item (different pricing mode)
        const existingItem = cart[existingItemIndex];
        const samePricingMode =
            (existingItem.isBoxPricing ?? false) === (product.isBoxPricing ?? false) &&
            (existingItem.piecesPerBox ?? null) === (product.piecesPerBox ?? null);
        if (samePricingMode) {
            const nextQty = cart[existingItemIndex].quantity + qtyToAdd;
            cart[existingItemIndex].stock = product.stock ?? cart[existingItemIndex].stock;
            cart[existingItemIndex].quantity =
                availableStock == null
                    ? nextQty
                    : Math.min(nextQty, Math.max(0, availableStock));
        } else {
            // Different pricing mode, add as separate item
            cart.push({
                _id: product._id,
                name: product.name,
                price: product.price,
                picUrls: product.picUrls || [],
                quantity: qtyToAdd,
                description: product.description || '',
                categories: product.categories || [],
                sku: product.sku || product.SKU || product._id,
                isBoxPricing: product.isBoxPricing || false,
                piecesPerBox: product.piecesPerBox || undefined,
                stock: product.stock ?? product.quantity ?? undefined
            });
        }
    } else {
        // Add new product to cart
        cart.push({
            _id: product._id,
            name: product.name,
            price: product.price,
            picUrls: product.picUrls || [],
            quantity: qtyToAdd,
            description: product.description || '',
            categories: product.categories || [],
            sku: product.sku || product.SKU || product._id,
            isBoxPricing: product.isBoxPricing || false,
            piecesPerBox: product.piecesPerBox || undefined,
            stock: product.stock ?? product.quantity ?? undefined
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
        const availableStock = getAvailableStock(cart[itemIndex]);
        cart[itemIndex].quantity =
            availableStock == null
                ? quantity
                : Math.min(quantity, Math.max(0, availableStock));
        saveCart(cart);
    }

    return cart;
};

// Get quantity in cart for a product with specific pricing mode (for product page)
export const getCartQtyForProduct = (productId, isBoxPricing = false) => {
    const cart = getCart();
    const item = cart.find(
        (i) =>
            i._id === productId &&
            (i.isBoxPricing ?? false) === !!isBoxPricing
    );
    return item?.quantity ?? 0;
};

// Update or remove cart line by product id and pricing mode (for product page counter)
export const updateCartItemQuantityByMode = (productId, isBoxPricing, quantity) => {
    const cart = getCart();
    const itemIndex = cart.findIndex(
        (i) =>
            i._id === productId &&
            (i.isBoxPricing ?? false) === !!isBoxPricing
    );
    if (itemIndex === -1) {
        if (quantity > 0) return cart; // nothing to update
        return cart;
    }
    if (quantity <= 0) {
        cart.splice(itemIndex, 1);
        saveCart(cart);
        return cart;
    }
    const availableStock = getAvailableStock(cart[itemIndex]);
    cart[itemIndex].quantity =
        availableStock == null
            ? quantity
            : Math.min(quantity, Math.max(0, availableStock));
    saveCart(cart);
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

