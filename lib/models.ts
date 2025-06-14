import { Provider } from '@/frontend/stores/APIKeyStore';

export const AI_MODELS = [
  // Ultra Budget Models
  'Gemini 1.5 Flash-8B',
  'Ministral 3B',
  'Gemini 2.0 Flash Lite',
  'DeepSeek-V3',
  'Claude Haiku 3',
  
  // Budget Models
  'GPT-4.1 nano',
  'GPT-4o mini',
  'Gemini 1.5 Flash',
  'Gemini 2.5 Flash',
  'Gemini 2.0 Flash',
  'GPT-4.1 mini',
  'Mistral Large',
  'DeepSeek-R1',
  'Claude Haiku 3.5',
  'o1-mini',
  'o3-mini',
  'o4-mini',
  
  // Standard Models
  'GPT-4.1',
  'GPT-4o',
  'Gemini 1.5 Pro',
  'Claude Sonnet 3.5',
  'Claude Sonnet 3.7',
  'Claude Sonnet 4',
  
  // Premium Models
  'Gemini 2.5 Pro',
  'xAI Grok-beta',
  'o3',
  'Claude Opus 3',
  'Claude Opus 4',
  'o1',
  
  // Ultra Premium Models
  'GPT-4.5',
  'o1-pro',
] as const;

export type AIModel = (typeof AI_MODELS)[number];

export type ModelConfig = {
  modelId: string;
  provider: Provider;
  headerKey: string;
  category: string;
  inputPrice: number;
  outputPrice: number;
  contextWindow: string;
  description: string;
};

export const MODEL_CONFIGS = {
  // Ultra Budget Models
  'Gemini 1.5 Flash-8B': {
    modelId: 'gemini-1.5-flash-8b',
    provider: 'google',
    headerKey: 'X-Google-API-Key',
    category: 'Ultra Budget',
    inputPrice: 0.0375,
    outputPrice: 0.15,
    contextWindow: '128K',
    description: 'Smallest model for simple tasks',
  },
  'Ministral 3B': {
    modelId: 'ministral-3b',
    provider: 'openrouter',
    headerKey: 'X-OpenRouter-API-Key',
    category: 'Ultra Budget',
    inputPrice: 0.04,
    outputPrice: 0.04,
    contextWindow: '128K',
    description: 'Very affordable European AI model',
  },
  'Gemini 2.0 Flash Lite': {
    modelId: 'gemini-2.0-flash-lite',
    provider: 'google',
    headerKey: 'X-Google-API-Key',
    category: 'Ultra Budget',
    inputPrice: 0.075,
    outputPrice: 0.30,
    contextWindow: '1M',
    description: 'Most affordable Google model',
  },
  'DeepSeek-V3': {
    modelId: 'deepseek-chat',
    provider: 'deepseek',
    headerKey: 'X-DeepSeek-API-Key',
    category: 'Ultra Budget',
    inputPrice: 0.27,
    outputPrice: 1.10,
    contextWindow: '64K',
    description: 'Excellent for coding at ultra-low cost',
  },
  'Claude Haiku 3': {
    modelId: 'claude-3-haiku-20240307',
    provider: 'anthropic',
    headerKey: 'X-Anthropic-API-Key',
    category: 'Ultra Budget',
    inputPrice: 0.25,
    outputPrice: 1.25,
    contextWindow: '200K',
    description: 'Most affordable Claude model',
  },
  
  // Budget Models
  'GPT-4.1 nano': {
    modelId: 'gpt-4.1-nano',
    provider: 'openai',
    headerKey: 'X-OpenAI-API-Key',
    category: 'Budget',
    inputPrice: 0.10,
    outputPrice: 0.40,
    contextWindow: '200K',
    description: 'Fastest, most cost-effective for low-latency',
  },
  'Gemini 1.5 Flash': {
    modelId: 'gemini-1.5-flash',
    provider: 'google',
    headerKey: 'X-Google-API-Key',
    category: 'Budget',
    inputPrice: 0.075,
    outputPrice: 0.30,
    contextWindow: '128K',
    description: 'Previous generation Flash',
  },
  'Gemini 2.5 Flash': {
    modelId: 'gemini-2.5-flash',
    provider: 'google',
    headerKey: 'X-Google-API-Key',
    category: 'Budget',
    inputPrice: 0.15,
    outputPrice: 0.60,
    contextWindow: '1M',
    description: 'Fast and affordable',
  },
  'Gemini 2.0 Flash': {
    modelId: 'gemini-2.0-flash',
    provider: 'google',
    headerKey: 'X-Google-API-Key',
    category: 'Budget',
    inputPrice: 0.15,
    outputPrice: 0.60,
    contextWindow: '1M',
    description: 'Text, image, video, audio support',
  },
  'GPT-4o mini': {
    modelId: 'gpt-4o-mini',
    provider: 'openai',
    headerKey: 'X-OpenAI-API-Key',
    category: 'Budget',
    inputPrice: 0.15,
    outputPrice: 0.60,
    contextWindow: '128K',
    description: 'Cheaper multimodal option',
  },
  'GPT-4.1 mini': {
    modelId: 'gpt-4.1-mini',
    provider: 'openai',
    headerKey: 'X-OpenAI-API-Key',
    category: 'Budget',
    inputPrice: 0.40,
    outputPrice: 1.60,
    contextWindow: '200K',
    description: 'Balanced speed and intelligence',
  },
  'Mistral Large': {
    modelId: 'mistral-large',
    provider: 'openrouter',
    headerKey: 'X-OpenRouter-API-Key',
    category: 'Budget',
    inputPrice: 0.40,
    outputPrice: 2.00,
    contextWindow: '128K',
    description: 'European AI model',
  },
  'DeepSeek-R1': {
    modelId: 'deepseek-reasoner',
    provider: 'deepseek',
    headerKey: 'X-DeepSeek-API-Key',
    category: 'Budget',
    inputPrice: 0.55,
    outputPrice: 2.19,
    contextWindow: '64K',
    description: 'Reasoning-focused model',
  },
  'Claude Haiku 3.5': {
    modelId: 'claude-3-5-haiku-20241022',
    provider: 'anthropic',
    headerKey: 'X-Anthropic-API-Key',
    category: 'Budget',
    inputPrice: 0.80,
    outputPrice: 4.00,
    contextWindow: '200K',
    description: 'Speed-optimized model',
  },
  'o1-mini': {
    modelId: 'o1-mini',
    provider: 'openai',
    headerKey: 'X-OpenAI-API-Key',
    category: 'Budget Reasoning',
    inputPrice: 1.10,
    outputPrice: 4.40,
    contextWindow: '128K',
    description: 'Cost-efficient reasoning for coding',
  },
  'o3-mini': {
    modelId: 'o3-mini',
    provider: 'openai',
    headerKey: 'X-OpenAI-API-Key',
    category: 'Budget Reasoning',
    inputPrice: 1.10,
    outputPrice: 4.40,
    contextWindow: '200K',
    description: 'Newer reasoning model for math and coding',
  },
  'o4-mini': {
    modelId: 'o4-mini',
    provider: 'openai',
    headerKey: 'X-OpenAI-API-Key',
    category: 'Budget Reasoning',
    inputPrice: 1.10,
    outputPrice: 4.40,
    contextWindow: '200K',
    description: 'Faster, cost-efficient reasoning',
  },
  
  // Standard Models
  'GPT-4.1': {
    modelId: 'gpt-4.1',
    provider: 'openai',
    headerKey: 'X-OpenAI-API-Key',
    category: 'Premium',
    inputPrice: 2.00,
    outputPrice: 8.00,
    contextWindow: '200K',
    description: 'Smartest model for complex tasks',
  },
  'GPT-4o': {
    modelId: 'gpt-4o',
    provider: 'openai',
    headerKey: 'X-OpenAI-API-Key',
    category: 'Standard',
    inputPrice: 2.50,
    outputPrice: 10.00,
    contextWindow: '128K',
    description: 'Text and image processing',
  },
  'Gemini 1.5 Pro': {
    modelId: 'gemini-1.5-pro',
    provider: 'google',
    headerKey: 'X-Google-API-Key',
    category: 'Standard',
    inputPrice: 2.50,
    outputPrice: 10.00,
    contextWindow: '1M',
    description: 'Previous generation Pro model',
  },
  'Claude Sonnet 3.5': {
    modelId: 'claude-3-5-sonnet-20241022',
    provider: 'anthropic',
    headerKey: 'X-Anthropic-API-Key',
    category: 'Standard',
    inputPrice: 3.00,
    outputPrice: 15.00,
    contextWindow: '200K',
    description: 'Popular general-purpose model',
  },
  'Claude Sonnet 3.7': {
    modelId: 'claude-3.7-sonnet',
    provider: 'openrouter',
    headerKey: 'X-OpenRouter-API-Key',
    category: 'Standard',
    inputPrice: 3.00,
    outputPrice: 15.00,
    contextWindow: '200K',
    description: 'Enhanced for coding and writing',
  },
  'Claude Sonnet 4': {
    modelId: 'claude-4-sonnet',
    provider: 'openrouter',
    headerKey: 'X-OpenRouter-API-Key',
    category: 'Standard',
    inputPrice: 3.00,
    outputPrice: 15.00,
    contextWindow: '200K',
    description: 'Latest Sonnet model',
  },
  
  // Premium Models
  'Gemini 2.5 Pro': {
    modelId: 'gemini-2.5-pro',
    provider: 'google',
    headerKey: 'X-Google-API-Key',
    category: 'Premium',
    inputPrice: 1.25,
    outputPrice: 10.00,
    contextWindow: '1M',
    description: 'Advanced reasoning and coding',
  },
  'xAI Grok-beta': {
    modelId: 'grok-beta',
    provider: 'openrouter',
    headerKey: 'X-OpenRouter-API-Key',
    category: 'Premium',
    inputPrice: 5.00,
    outputPrice: 15.00,
    contextWindow: '131K',
    description: 'Elon Musk\'s AI model',
  },
  'o3': {
    modelId: 'o3',
    provider: 'openai',
    headerKey: 'X-OpenAI-API-Key',
    category: 'Premium Reasoning',
    inputPrice: 10.00,
    outputPrice: 40.00,
    contextWindow: '200K',
    description: 'Most powerful reasoning model',
  },
  'Claude Opus 3': {
    modelId: 'claude-3-opus',
    provider: 'openrouter',
    headerKey: 'X-OpenRouter-API-Key',
    category: 'Premium',
    inputPrice: 15.00,
    outputPrice: 75.00,
    contextWindow: '200K',
    description: 'Previous generation Opus',
  },
  'Claude Opus 4': {
    modelId: 'claude-4-opus',
    provider: 'openrouter',
    headerKey: 'X-OpenRouter-API-Key',
    category: 'Premium',
    inputPrice: 15.00,
    outputPrice: 75.00,
    contextWindow: '500K',
    description: 'Most capable Claude model',
  },
  'o1': {
    modelId: 'o1',
    provider: 'openai',
    headerKey: 'X-OpenAI-API-Key',
    category: 'Premium Reasoning',
    inputPrice: 15.00,
    outputPrice: 60.00,
    contextWindow: '200K',
    description: 'High-level reasoning model',
  },
  
  // Ultra Premium Models
  'GPT-4.5': {
    modelId: 'gpt-4.5',
    provider: 'openai',
    headerKey: 'X-OpenAI-API-Key',
    category: 'Ultra Premium',
    inputPrice: 75.00,
    outputPrice: 150.00,
    contextWindow: '128K',
    description: 'Latest GPT model, highest quality',
  },
  'o1-pro': {
    modelId: 'o1-pro',
    provider: 'openai',
    headerKey: 'X-OpenAI-API-Key',
    category: 'Ultra Premium',
    inputPrice: 150.00,
    outputPrice: 600.00,
    contextWindow: '200K',
    description: 'Most expensive API offering',
  },
} as const satisfies Record<AIModel, ModelConfig>;

export const getModelConfig = (modelName: AIModel): ModelConfig => {
  return MODEL_CONFIGS[modelName];
};
