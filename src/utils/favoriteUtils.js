// Favorite utility functions for managing favorites in localStorage

// Get favorites from localStorage
export const getFavorites = () => {
    if (typeof window === 'undefined') return [];
    try {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error('Error getting favorites from localStorage:', error);
        return [];
    }
};

// Save favorites to localStorage
export const saveFavorites = (favorites) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
    }
};

// Check if product is favorited
export const isFavorited = (productId) => {
    const favorites = getFavorites();
    return favorites.some(item => item._id === productId);
};

// Add product to favorites
export const addToFavorites = (product) => {
    const favorites = getFavorites();

    // Check if already favorited
    if (favorites.some(item => item._id === product._id)) {
        return favorites;
    }

    // Add new product to favorites
    favorites.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        picUrls: product.picUrls || [],
        description: product.description || '',
        categories: product.categories || []
    });

    saveFavorites(favorites);
    return favorites;
};

// Remove product from favorites
export const removeFromFavorites = (productId) => {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(item => item._id !== productId);
    saveFavorites(updatedFavorites);
    return updatedFavorites;
};

// Toggle favorite (add if not favorited, remove if favorited)
export const toggleFavorite = (product) => {
    const wasFavorited = isFavorited(product._id);
    if (wasFavorited) {
        return removeFromFavorites(product._id);
    } else {
        return addToFavorites(product);
    }
};

// Clear all favorites
export const clearFavorites = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('favorites');
    return [];
};

// Get favorites count
export const getFavoritesCount = () => {
    const favorites = getFavorites();
    return favorites.length;
};

