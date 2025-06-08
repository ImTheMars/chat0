import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AIModel } from '@/lib/models';

type FavoriteModelsStore = {
  favoriteModels: AIModel[];
  toggleFavorite: (model: AIModel) => void;
  isFavorite: (model: AIModel) => boolean;
};

export const useFavoriteModelsStore = create<FavoriteModelsStore>()(
  persist(
    (set, get) => ({
      favoriteModels: [],

      toggleFavorite: (model) => {
        set((state) => {
          const isFavorite = state.favoriteModels.includes(model);
          return {
            favoriteModels: isFavorite
              ? state.favoriteModels.filter((m) => m !== model)
              : [...state.favoriteModels, model],
          };
        });
      },

      isFavorite: (model) => {
        return get().favoriteModels.includes(model);
      },
    }),
    {
      name: 'favorite-models',
      partialize: (state) => ({ favoriteModels: state.favoriteModels }),
    }
  )
); 