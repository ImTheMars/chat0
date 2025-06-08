import { create, Mutate, StoreApi } from 'zustand';
import { persist } from 'zustand/middleware';
import { AIModel, getModelConfig, ModelConfig } from '@/lib/models';

type ModelStore = {
  selectedModel: string; // Changed to string to support custom models
  setModel: (model: string) => void;
  getModelConfig: () => ModelConfig | null;
  isCustomModel: () => boolean;
};

type StoreWithPersist = Mutate<
  StoreApi<ModelStore>,
  [['zustand/persist', { selectedModel: string }]]
>;

export const withStorageDOMEvents = (store: StoreWithPersist) => {
  const storageEventCallback = (e: StorageEvent) => {
    if (e.key === store.persist.getOptions().name && e.newValue) {
      store.persist.rehydrate();
    }
  };

  window.addEventListener('storage', storageEventCallback);

  return () => {
    window.removeEventListener('storage', storageEventCallback);
  };
};

export const useModelStore = create<ModelStore>()(
  persist(
    (set, get) => ({
      selectedModel: 'Gemini 2.5 Flash',

      setModel: (model) => {
        set({ selectedModel: model });
      },

      getModelConfig: () => {
        const { selectedModel } = get();
        // Check if it's a predefined model
        try {
          return getModelConfig(selectedModel as AIModel);
        } catch {
          // For custom OpenRouter models, return a basic config
          return {
            modelId: selectedModel,
            provider: 'openrouter' as const,
            headerKey: 'X-OpenRouter-API-Key',
            category: 'Custom',
            inputPrice: 0,
            outputPrice: 0,
            contextWindow: 'Unknown',
            description: 'Custom OpenRouter model',
          };
        }
      },

      isCustomModel: () => {
        const { selectedModel } = get();
        try {
          getModelConfig(selectedModel as AIModel);
          return false;
        } catch {
          return true;
        }
      },
    }),
    {
      name: 'selected-model',
      partialize: (state) => ({ selectedModel: state.selectedModel }),
    }
  )
);

withStorageDOMEvents(useModelStore);
