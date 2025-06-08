import { useCompletion } from '@ai-sdk/react';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import { toast } from 'sonner';
import { createMessageSummary, updateThread } from '@/frontend/dexie/queries';

interface MessageSummaryPayload {
  title: string;
  isTitle?: boolean;
  messageId: string;
  threadId: string;
}

function getCompletionConfig(
  getKey: (key: 'google' | 'openai' | 'openrouter') => string | undefined
) {
  const openrouterKey = getKey('openrouter');
  const openaiKey = getKey('openai');
  const googleKey = getKey('google');

  let headers = {};
  if (openrouterKey) {
    headers = {
      'X-Model-Provider': 'openrouter',
      'X-OpenRouter-API-Key': openrouterKey,
    };
  } else if (openaiKey) {
    headers = { 'X-Model-Provider': 'openai', 'X-OpenAI-API-Key': openaiKey };
  } else if (googleKey) {
    headers = { 'X-Model-Provider': 'google', 'X-Google-API-Key': googleKey };
  } else {
    return null;
  }

  return {
    api: '/api/completion',
    headers,
  };
}

export const useMessageSummary = () => {
  const getKey = useAPIKeyStore((state) => state.getKey);
  const completionConfig = getCompletionConfig(getKey);

  const { complete, isLoading } = useCompletion({
    ...completionConfig,
    onResponse: async (response) => {
      if (!completionConfig) return;
      try {
        const payload: MessageSummaryPayload = await response.json();

        if (response.ok) {
          const { title, isTitle, messageId, threadId } = payload;

          if (isTitle) {
            await updateThread(threadId, title);
            await createMessageSummary(threadId, messageId, title);
          } else {
            await createMessageSummary(threadId, messageId, title);
          }
        } else {
          toast.error('Failed to generate a summary for the message');
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  return {
    complete,
    isLoading,
  };
};
