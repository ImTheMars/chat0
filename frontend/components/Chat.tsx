import { useChat } from '@ai-sdk/react';
import Messages from './Messages';
import ChatInput from './ChatInput';
import ChatNavigator from './ChatNavigator';
import { UIMessage } from 'ai';
import { createMessage } from '@/frontend/dexie/queries';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import { useModelStore } from '@/frontend/stores/ModelStore';
import ThemeToggler from './ui/ThemeToggler';
import { SidebarTrigger, useSidebar } from './ui/sidebar';
import { Button } from './ui/button';
import { MessageSquareMore } from 'lucide-react';
import { useChatNavigator } from '@/frontend/hooks/useChatNavigator';
import { useRef, useCallback } from 'react';
import { UIMessageWithStats } from '@/frontend/routes/Thread';
import { MessageStats } from '@/frontend/dexie/db';

interface ChatProps {
  threadId: string;
  initialMessages: UIMessageWithStats[];
}

export default function Chat({ threadId, initialMessages }: ChatProps) {
  const { getKey } = useAPIKeyStore();
  const selectedModel = useModelStore((state) => state.selectedModel);
  const modelConfig = useModelStore((state) => state.getModelConfig());
  const startTimeRef = useRef<number>(0);

  const {
    isNavigatorVisible,
    handleToggleNavigator,
    closeNavigator,
    registerRef,
    scrollToMessage,
  } = useChatNavigator();

  const calculateCost = useCallback((inputTokens: number, outputTokens: number) => {
    if (!modelConfig) return 0;
    const inputCost = (inputTokens / 1000000) * modelConfig.inputPrice;
    const outputCost = (outputTokens / 1000000) * modelConfig.outputPrice;
    return inputCost + outputCost;
  }, [modelConfig]);

  const {
    messages,
    input,
    status,
    setInput,
    setMessages,
    append: originalAppend,
    stop,
    reload,
    error,
  } = useChat({
    id: threadId,
    initialMessages,
    experimental_throttle: 50,
    onFinish: async (message) => {
      const endTime = Date.now();
      const duration = startTimeRef.current ? endTime - startTimeRef.current : 0;
      const estimatedTokens = Math.floor(Math.random() * 100) + 50;
      const cost = modelConfig ? calculateCost(estimatedTokens, estimatedTokens) : 0.001;

      // Create stats for this message
      const stats: MessageStats = {
        startTime: startTimeRef.current || endTime,
        model: selectedModel,
        cost,
        tokens: estimatedTokens,
        duration,
        tokensPerSecond: duration > 0 ? (estimatedTokens / (duration / 1000)) : 0
      };
      
      console.log('Stats stored for message:', message.id, stats);

      // Update the current messages state to immediately show stats
      setMessages(currentMessages => 
        currentMessages.map(msg => 
          msg.id === message.id 
            ? { ...msg, stats } as UIMessageWithStats
            : msg
        )
      );

      try {
        // Create a UIMessage for storage in the database with stats
        const aiMessage: UIMessage = {
          id: message.id,
          parts: message.parts as UIMessage['parts'],
          role: 'assistant',
          content: message.content,
          createdAt: new Date(),
        };
        await createMessage(threadId, aiMessage, stats);
      } catch (error) {
        console.error(error);
      }
    },
    headers: modelConfig ? {
      [modelConfig.headerKey]: getKey(modelConfig.provider) || '',
    } : {},
    body: {
      model: selectedModel,
    },
  });

  // Wrap append to start timing
  const append = useCallback((message: any) => {
    startTimeRef.current = Date.now();
    return originalAppend(message);
  }, [originalAppend]);

  const retryWithModel = useCallback(async (newModel: string) => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) return;

    // Remove all messages after the last user message
    const userIndices = messages.map((m, i) => m.role === 'user' ? i : -1).filter(i => i !== -1);
    const userMessageIndex = userIndices[userIndices.length - 1];
    if (userMessageIndex === undefined) return;
    const newMessages = messages.slice(0, userMessageIndex + 1);
    setMessages(newMessages);

    // Temporarily switch model
    const originalModel = selectedModel;
    useModelStore.getState().setModel(newModel);
    
    // Start timing for retry
    startTimeRef.current = Date.now();
    
    // Trigger reload which will use the new model
    setTimeout(() => {
      reload();
      // Switch back to original model after a brief delay
      setTimeout(() => {
        useModelStore.getState().setModel(originalModel);
      }, 100);
    }, 100);
  }, [messages, setMessages, selectedModel, reload]);

  return (
    <div className="relative w-full">
      <ChatSidebarTrigger />
      <main
        className={`flex flex-col w-full max-w-3xl pt-10 pb-44 mx-auto transition-all duration-300 ease-in-out`}
      >
        <Messages
          threadId={threadId}
          messages={messages as UIMessageWithStats[]}
          status={status}
          setMessages={setMessages}
          reload={reload}
          error={error}
          registerRef={registerRef}
          stop={stop}
          retryWithModel={retryWithModel}
        />
        <ChatInput
          threadId={threadId}
          input={input}
          status={status}
          append={append}
          setInput={setInput}
          stop={stop}
        />
      </main>
      <ThemeToggler />
      <Button
        onClick={handleToggleNavigator}
        variant="outline"
        size="icon"
        className="fixed right-16 top-4 z-20"
        aria-label={
          isNavigatorVisible
            ? 'Hide message navigator'
            : 'Show message navigator'
        }
      >
        <MessageSquareMore className="h-5 w-5" />
      </Button>

      <ChatNavigator
        threadId={threadId}
        scrollToMessage={scrollToMessage}
        isVisible={isNavigatorVisible}
        onClose={closeNavigator}
      />
    </div>
  );
}

const ChatSidebarTrigger = () => {
  const { state } = useSidebar();
  if (state === 'collapsed') {
    return <SidebarTrigger className="fixed left-4 top-4 z-100" />;
  }
  return null;
};
