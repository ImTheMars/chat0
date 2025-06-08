import { ChevronDown, Check, ArrowUpIcon, Star } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { Textarea } from '@/frontend/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Button } from '@/frontend/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/frontend/components/ui/dropdown-menu';
import useAutoResizeTextarea from '@/hooks/useAutoResizeTextArea';
import { UseChatHelpers, useCompletion } from '@ai-sdk/react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { createMessage, createThread } from '@/frontend/dexie/queries';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import { useModelStore } from '@/frontend/stores/ModelStore';
import { useFavoriteModelsStore } from '@/frontend/stores/FavoriteModelsStore';
import { AI_MODELS, AIModel, getModelConfig } from '@/lib/models';
import KeyPrompt from '@/frontend/components/KeyPrompt';
import { UIMessage } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import { StopIcon } from './ui/icons';
import { toast } from 'sonner';
import { useMessageSummary } from '../hooks/useMessageSummary';

interface ChatInputProps {
  threadId: string;
  input: UseChatHelpers['input'];
  status: UseChatHelpers['status'];
  setInput: UseChatHelpers['setInput'];
  append: UseChatHelpers['append'];
  stop: UseChatHelpers['stop'];
}

interface StopButtonProps {
  stop: UseChatHelpers['stop'];
}

interface SendButtonProps {
  onSubmit: () => void;
  disabled: boolean;
}

const createUserMessage = (id: string, text: string): UIMessage => ({
  id,
  parts: [{ type: 'text', text }],
  role: 'user',
  content: text,
  createdAt: new Date(),
});

function PureChatInput({
  threadId,
  input,
  status,
  setInput,
  append,
  stop,
}: ChatInputProps) {
  const canChat = useAPIKeyStore((state) => state.hasRequiredKeys());

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 72,
    maxHeight: 200,
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const isDisabled = useMemo(
    () => !input.trim() || status === 'streaming' || status === 'submitted',
    [input, status]
  );

  const { complete } = useMessageSummary();

  const handleSubmit = useCallback(async () => {
    const currentInput = textareaRef.current?.value || input;

    if (
      !currentInput.trim() ||
      status === 'streaming' ||
      status === 'submitted'
    )
      return;

    const messageId = uuidv4();

    if (!id) {
      navigate(`/chat/${threadId}`);
      await createThread(threadId);
      complete(currentInput.trim(), {
        body: { threadId, messageId, isTitle: true },
      });
    } else {
      complete(currentInput.trim(), { body: { messageId, threadId } });
    }

    const userMessage = createUserMessage(messageId, currentInput.trim());
    await createMessage(threadId, userMessage);

    append(userMessage);
    setInput('');
    adjustHeight(true);
  }, [
    input,
    status,
    setInput,
    adjustHeight,
    append,
    id,
    textareaRef,
    threadId,
    complete,
  ]);

  if (!canChat) {
    return <KeyPrompt />;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustHeight();
  };

  return (
    <div className="fixed bottom-0 w-full max-w-3xl">
      <div className="bg-secondary rounded-t-[20px] p-2 pb-0 w-full">
        <div className="relative">
          <div className="flex flex-col">
            <div className="bg-secondary overflow-y-auto max-h-[300px]">
              <Textarea
                id="chat-input"
                value={input}
                placeholder="What can I do for you?"
                className={cn(
                  'w-full px-4 py-3 border-none shadow-none dark:bg-transparent',
                  'placeholder:text-muted-foreground resize-none',
                  'focus-visible:ring-0 focus-visible:ring-offset-0',
                  'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/30',
                  'scrollbar-thumb-rounded-full',
                  'min-h-[72px]'
                )}
                ref={textareaRef}
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
                aria-label="Chat message input"
                aria-describedby="chat-input-description"
              />
              <span id="chat-input-description" className="sr-only">
                Press Enter to send, Shift+Enter for new line
              </span>
            </div>

            <div className="h-14 flex items-center px-2">
              <div className="flex items-center justify-between w-full">
                <ChatModelDropdown />

                {status === 'submitted' || status === 'streaming' ? (
                  <StopButton stop={stop} />
                ) : (
                  <SendButton onSubmit={handleSubmit} disabled={isDisabled} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ChatInput = memo(PureChatInput, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;
  if (prevProps.status !== nextProps.status) return false;
  return true;
});

const FavoriteModelsSection = ({ 
  selectedModel, 
  setModel, 
  isModelEnabled 
}: {
  selectedModel: AIModel;
  setModel: (model: AIModel) => void;
  isModelEnabled: (model: AIModel) => boolean;
}) => {
  const { favoriteModels } = useFavoriteModelsStore();
  
  if (favoriteModels.length === 0) return null;

  return (
    <>
      <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-1">
        <Star className="w-3 h-3 text-yellow-500" />
        Favorites
      </DropdownMenuLabel>
      {favoriteModels.map((model) => {
        const isEnabled = isModelEnabled(model);
        return (
          <DropdownMenuItem
            key={`favorite-${model}`}
            onSelect={() => isEnabled && setModel(model)}
            disabled={!isEnabled}
            className={cn(
              'flex items-center justify-between gap-2',
              'cursor-pointer pl-6'
            )}
          >
            <span>{model}</span>
            {selectedModel === model && (
              <Check
                className="w-4 h-4 text-blue-500"
                aria-label="Selected"
              />
            )}
          </DropdownMenuItem>
        );
      })}
      <DropdownMenuSeparator />
    </>
  );
};

const QuickSelectSection = ({ 
  selectedModel, 
  setModel, 
  isModelEnabled 
}: {
  selectedModel: string;
  setModel: (model: string) => void;
  isModelEnabled: (model: AIModel) => boolean;
}) => {
  const { favoriteModels } = useFavoriteModelsStore();
  
  // Only show top 6 favorites, or first 6 models if no favorites
  const modelsToShow = favoriteModels.length > 0 
    ? favoriteModels.slice(0, 6)
    : AI_MODELS.slice(0, 6);
  
  return (
    <>
      <DropdownMenuLabel className="text-xs text-muted-foreground">
        {favoriteModels.length > 0 ? 'Quick Select (Top 6)' : 'Available Models (Top 6)'}
      </DropdownMenuLabel>
      {modelsToShow.map((model) => {
        const isEnabled = isModelEnabled(model);
        const isFavorite = favoriteModels.includes(model);
        return (
          <DropdownMenuItem
            key={`quick-${model}`}
            onSelect={() => isEnabled && setModel(model)}
            disabled={!isEnabled}
            className={cn(
              'flex items-center justify-between gap-2',
              'cursor-pointer pl-3'
            )}
          >
            <div className="flex items-center gap-2">
              {isFavorite && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
              <span>{model}</span>
            </div>
            {selectedModel === model && (
              <Check
                className="w-4 h-4 text-blue-500"
                aria-label="Selected"
              />
            )}
          </DropdownMenuItem>
        );
      })}
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-xs text-muted-foreground cursor-default" disabled>
        {favoriteModels.length > 0 
          ? `Showing top 6 favorites. Total: ${favoriteModels.length}`
          : `Showing first 6 models. Total: ${AI_MODELS.length}`
        }
      </DropdownMenuItem>
    </>
  );
};

const CustomModelsSection = ({ 
  selectedModel, 
  setModel, 
  isCustomModelEnabled 
}: {
  selectedModel: string;
  setModel: (model: string) => void;
  isCustomModelEnabled: () => boolean;
}) => {
  const { customModels } = useAPIKeyStore();
  
  if (customModels.openrouter.length === 0) return null;

  return (
    <>
      <DropdownMenuLabel className="text-xs text-muted-foreground">
        Custom OpenRouter Models
      </DropdownMenuLabel>
      {customModels.openrouter.map((model) => {
        const isEnabled = isCustomModelEnabled();
        return (
          <DropdownMenuItem
            key={`custom-${model}`}
            onSelect={() => isEnabled && setModel(model)}
            disabled={!isEnabled}
            className={cn(
              'flex items-center justify-between gap-2',
              'cursor-pointer pl-3 font-mono text-xs'
            )}
          >
            <span>{model}</span>
            {selectedModel === model && (
              <Check
                className="w-4 h-4 text-blue-500"
                aria-label="Selected"
              />
            )}
          </DropdownMenuItem>
        );
      })}
      <DropdownMenuSeparator />
    </>
  );
};

const PureChatModelDropdown = () => {
  const getKey = useAPIKeyStore((state) => state.getKey);
  const { customModels } = useAPIKeyStore();
  const { selectedModel, setModel } = useModelStore();

  const isModelEnabled = useCallback(
    (model: AIModel) => {
      const modelConfig = getModelConfig(model);
      const apiKey = getKey(modelConfig.provider);
      return !!apiKey;
    },
    [getKey]
  );

  const isCustomModelEnabled = useCallback(() => {
    const apiKey = getKey('openrouter');
    return !!apiKey;
  }, [getKey]);

  // Handle setting custom models that aren't in the predefined list
  const handleSetModel = useCallback((model: string) => {
    if (AI_MODELS.includes(model as AIModel)) {
      setModel(model as AIModel);
    } else {
      // For custom models, we need to update the store differently
      // This is a custom OpenRouter model
      setModel(model as AIModel);
    }
  }, [setModel]);

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-1 h-8 pl-2 pr-2 text-xs rounded-md text-foreground hover:bg-primary/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
            aria-label={`Selected model: ${selectedModel}`}
          >
            <div className="flex items-center gap-1">
              <span className={cn(
                AI_MODELS.includes(selectedModel as any) ? '' : 'font-mono'
              )}>
                {selectedModel}
              </span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn('min-w-[10rem]', 'border-border', 'bg-popover')}
        >
          <FavoriteModelsSection
            selectedModel={selectedModel as any}
            setModel={handleSetModel}
            isModelEnabled={isModelEnabled}
          />
          <CustomModelsSection
            selectedModel={selectedModel}
            setModel={handleSetModel}
            isCustomModelEnabled={isCustomModelEnabled}
          />
          <QuickSelectSection
            selectedModel={selectedModel}
            setModel={handleSetModel}
            isModelEnabled={isModelEnabled}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ChatModelDropdown = memo(PureChatModelDropdown);

function PureStopButton({ stop }: StopButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={stop}
      aria-label="Stop generating response"
    >
      <StopIcon size={20} />
    </Button>
  );
}

const StopButton = memo(PureStopButton);

const PureSendButton = ({ onSubmit, disabled }: SendButtonProps) => {
  return (
    <Button
      onClick={onSubmit}
      variant="default"
      size="icon"
      disabled={disabled}
      aria-label="Send message"
    >
      <ArrowUpIcon size={18} />
    </Button>
  );
};

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  return prevProps.disabled === nextProps.disabled;
});

export default ChatInput;
