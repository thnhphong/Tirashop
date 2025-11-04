import React from 'react';
import { useFavorites } from '../context/FavoritesContext';

const FavoriteBtn = ({ product }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isFavorited = isFavorite(product.id);

  const handleToggleFavorite = () => {
    if (isFavorited) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <button
      className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors cursor-pointer hover:bg-white"
      onClick={handleToggleFavorite}
      title={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
    >
      <i
        className={isFavorited ? 'ri-heart-fill text-rose-600 text-sm' : 'ri-heart-line text-gray-600 text-sm'}
      />
    </button>
  );
};

export default FavoriteBtn;