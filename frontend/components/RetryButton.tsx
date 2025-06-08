import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { RotateCcw, ChevronDown } from 'lucide-react';
import { AI_MODELS, AIModel } from '@/lib/models';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import { getModelConfig } from '@/lib/models';
import { useFavoriteModelsStore } from '@/frontend/stores/FavoriteModelsStore';

interface RetryButtonProps {
  onRetry: (model: string) => void;
  currentModel: string;
}

export default function RetryButton({ onRetry, currentModel }: RetryButtonProps) {
  const getKey = useAPIKeyStore((state) => state.getKey);
  const { favoriteModels } = useFavoriteModelsStore();

  // Show only top 6 favorites or available models
  const availableModels = AI_MODELS.filter((model) => {
    const modelConfig = getModelConfig(model);
    const apiKey = getKey(modelConfig.provider);
    return !!apiKey && model !== currentModel;
  });

  const modelsToShow = favoriteModels.length > 0 
    ? favoriteModels.filter(m => availableModels.includes(m)).slice(0, 6)
    : availableModels.slice(0, 6);

  if (modelsToShow.length === 0) {
    return (
      <Button
        onClick={() => onRetry(currentModel)}
        variant="outline"
        size="sm"
        className="h-6 px-2 text-xs"
      >
        <RotateCcw className="w-3 h-3 mr-1" />
        Retry
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
          <RotateCcw className="w-3 h-3 mr-1" />
          Retry
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onRetry(currentModel)}>
          <RotateCcw className="w-3 h-3 mr-2" />
          Same model ({currentModel})
        </DropdownMenuItem>
        {modelsToShow.map((model) => (
          <DropdownMenuItem key={model} onClick={() => onRetry(model)}>
            <span className="font-mono text-xs">{model}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 