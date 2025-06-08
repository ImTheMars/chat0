import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Star, StarOff } from 'lucide-react';
import { AI_MODELS, getModelConfig } from '@/lib/models';
import { useFavoriteModelsStore } from '@/frontend/stores/FavoriteModelsStore';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';

export default function ModelsTab() {
  const { favoriteModels, toggleFavorite, isFavorite } = useFavoriteModelsStore();
  const { hasRequiredKeys, getKey } = useAPIKeyStore();

  const groupedByProvider = AI_MODELS.reduce((acc, model) => {
    const config = getModelConfig(model);
    if (!acc[config.provider]) {
      acc[config.provider] = [];
    }
    acc[config.provider].push(model);
    return acc;
  }, {} as Record<string, any[]>);

  const getProviderDisplayName = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'Google';
      case 'openrouter':
        return 'OpenRouter';
      case 'openai':
        return 'OpenAI';
      default:
        return provider;
    }
  };

  const isModelAvailable = (model: string) => {
    const config = getModelConfig(model as any);
    return !!getKey(config.provider);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Ultra Budget':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'Budget':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Budget Reasoning':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100';
      case 'Standard':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      case 'Premium':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'Premium Reasoning':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100';
      case 'Ultra Premium':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const providerOrder = ['openai', 'google', 'openrouter'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Available Models</h3>
        <p className="text-sm text-muted-foreground">
          Star your favorite models to access them quickly from the main chat interface.
        </p>
      </div>

      {favoriteModels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Favorite Models
            </CardTitle>
            <CardDescription>
              Your starred models appear in the quick model picker
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {favoriteModels.map((model) => {
                const modelConfig = getModelConfig(model);
                const available = isModelAvailable(model);
                
                return (
                  <div
                    key={model}
                    className={`relative p-3 border rounded-lg transition-all hover:shadow-md ${
                      !available ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className={`font-medium text-sm leading-tight ${!available ? 'text-muted-foreground' : ''}`}>
                        {model}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => available && toggleFavorite(model)}
                        disabled={!available}
                        className={`h-6 w-6 shrink-0 ${
                          available
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        <Star className="h-3 w-3 fill-current" />
                      </Button>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 flex-wrap">
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                          {getProviderDisplayName(modelConfig.provider)}
                        </Badge>
                        <Badge 
                          className={`text-xs px-1.5 py-0.5 ${getCategoryColor(modelConfig.category)}`}
                        >
                          {modelConfig.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>${modelConfig.inputPrice}/1M</span>
                        <span>•</span>
                        <span>{modelConfig.contextWindow}</span>
                      </div>
                      
                      <p className={`text-xs leading-tight ${!available ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                        {modelConfig.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {providerOrder.map((provider) => {
          const models = groupedByProvider[provider];
          if (!models || models.length === 0) return null;

          const providerHasKey = !!getKey(provider as any);

          return (
            <Card key={provider}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{getProviderDisplayName(provider)}</CardTitle>
                  {!providerHasKey && (
                    <Badge variant="outline" className="text-xs">
                      API Key Required
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {provider === 'openai' && 'Advanced language models from OpenAI including GPT and o-series reasoning models'}
                  {provider === 'google' && 'Google\'s Gemini models with multimodal capabilities and large context windows'}
                  {provider === 'openrouter' && 'Access to Claude, DeepSeek, Mistral, and other third-party models'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {(models as string[]).map((model) => {
                    const modelConfig = getModelConfig(model as any);
                    const available = isModelAvailable(model);
                    
                    return (
                      <div
                        key={model}
                        className={`relative p-3 border rounded-lg transition-all hover:shadow-md ${
                          !available ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className={`font-medium text-sm leading-tight ${!available ? 'text-muted-foreground' : ''}`}>
                            {model}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => available && toggleFavorite(model as any)}
                            disabled={!available}
                            className={`h-6 w-6 shrink-0 ${
                              isFavorite(model as any)
                                ? 'text-yellow-500 hover:text-yellow-600'
                                : available
                                ? 'text-gray-400 hover:text-yellow-500'
                                : 'text-muted-foreground cursor-not-allowed'
                            }`}
                          >
                            {isFavorite(model as any) ? (
                              <Star className="h-3 w-3 fill-current" />
                            ) : (
                              <Star className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        
                        <div className="space-y-1">
                          <Badge 
                            className={`text-xs px-1.5 py-0.5 ${getCategoryColor(modelConfig.category)}`}
                          >
                            {modelConfig.category}
                          </Badge>
                          
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span>${modelConfig.inputPrice}/1M</span>
                            <span>•</span>
                            <span>{modelConfig.contextWindow}</span>
                          </div>
                          
                          <p className={`text-xs leading-tight ${!available ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                            {modelConfig.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 