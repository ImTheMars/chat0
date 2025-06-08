import { create, Mutate, StoreApi } from 'zustand';
import { persist } from 'zustand/middleware';

export const PROVIDERS = ['google', 'openrouter', 'openai', 'anthropic', 'deepseek'] as const;
export type Provider = (typeof PROVIDERS)[number];

type APIKeys = Record<Provider, string>;

type CustomModels = {
  openrouter: string[];
};

type APIKeyStore = {
  keys: APIKeys;
  customModels: CustomModels;
  setKeys: (newKeys: Partial<APIKeys>) => void;
  setCustomModels: (provider: keyof CustomModels, models: string[]) => void;
  addCustomModel: (provider: keyof CustomModels, model: string) => void;
  removeCustomModel: (provider: keyof CustomModels, model: string) => void;
  hasRequiredKeys: () => boolean;
  getKey: (provider: Provider) => string | undefined;
};

type StoreWithPersist = Mutate<
  StoreApi<APIKeyStore>,
  [['zustand/persist', { keys: APIKeys; customModels: CustomModels }]]
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

export const useAPIKeyStore = create<APIKeyStore>()(
  persist(
    (set, get) => ({
      keys: {
        google: '',
        openrouter: '',
        openai: '',
        anthropic: '',
        deepseek: '',
      },

      customModels: {
        openrouter: [],
      },

      setKeys: (newKeys) => {
        set((state) => ({
          keys: { ...state.keys, ...newKeys },
        }));
      },

      setCustomModels: (provider, models) => {
        set((state) => ({
          customModels: { ...state.customModels, [provider]: models },
        }));
      },

      addCustomModel: (provider, model) => {
        set((state) => ({
          customModels: {
            ...state.customModels,
            [provider]: [...state.customModels[provider], model],
          },
        }));
      },

      removeCustomModel: (provider, model) => {
        set((state) => ({
          customModels: {
            ...state.customModels,
            [provider]: state.customModels[provider].filter((m) => m !== model),
          },
        }));
      },

      hasRequiredKeys: () => {
        const keys = get().keys;
        return !!(keys.google || keys.openrouter || keys.openai || keys.anthropic || keys.deepseek);
      },

      getKey: (provider) => {
        const key = get().keys[provider];
        return key ? key : undefined;
      },
    }),
    {
      name: 'api-keys',
      partialize: (state) => ({ keys: state.keys, customModels: state.customModels }),
    }
  )
);

withStorageDOMEvents(useAPIKeyStore);
