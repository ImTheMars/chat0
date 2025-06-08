import { memo, useState } from 'react';
import MarkdownRenderer from '@/frontend/components/MemoizedMarkdown';
import { cn } from '@/lib/utils';
import { UIMessage } from 'ai';
import equal from 'fast-deep-equal';
import MessageControls from './MessageControls';
import { UseChatHelpers } from '@ai-sdk/react';
import MessageEditor from './MessageEditor';
import MessageReasoning from './MessageReasoning';
import MessageStats from './MessageStats';
import RetryButton from './RetryButton';
import { UIMessageWithStats } from '@/frontend/routes/Thread';

function PureMessage({
  threadId,
  message,
  setMessages,
  reload,
  isStreaming,
  registerRef,
  stop,
  retryWithModel,
  messageStats,
}: {
  threadId: string;
  message: UIMessage | UIMessageWithStats;
  setMessages: UseChatHelpers['setMessages'];
  reload: UseChatHelpers['reload'];
  isStreaming: boolean;
  registerRef: (id: string, ref: HTMLDivElement | null) => void;
  stop: UseChatHelpers['stop'];
  retryWithModel?: (model: string) => void;
  messageStats?: { startTime: number; model: string; cost: number; tokens: number; duration: number; tokensPerSecond: number };
}) {
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  return (
    <div
      role="article"
      className={cn(
        'flex flex-col',
        message.role === 'user' ? 'items-end' : 'items-start'
      )}
    >
      {message.parts.map((part, index) => {
        const { type } = part;
        const key = `message-${message.id}-part-${index}`;

        if (type === 'reasoning') {
          return (
            <MessageReasoning
              key={key}
              reasoning={part.reasoning}
              id={message.id}
            />
          );
        }

        if (type === 'text') {
          return message.role === 'user' ? (
            <div
              key={key}
              className="relative group px-4 py-3 rounded-xl bg-secondary border border-secondary-foreground/2 max-w-[80%]"
              ref={(el) => registerRef(message.id, el)}
            >
              {mode === 'edit' && (
                <MessageEditor
                  threadId={threadId}
                  message={message}
                  content={part.text}
                  setMessages={setMessages}
                  reload={reload}
                  setMode={setMode}
                  stop={stop}
                />
              )}
              {mode === 'view' && <p>{part.text}</p>}

              {mode === 'view' && (
                <MessageControls
                  threadId={threadId}
                  content={part.text}
                  message={message}
                  setMode={setMode}
                  setMessages={setMessages}
                  reload={reload}
                  stop={stop}
                />
              )}
            </div>
          ) : (
            <div key={key} className="group flex flex-col gap-2 w-full">
              <MarkdownRenderer content={part.text} id={message.id} />
              {!isStreaming && (
                <div className="flex items-center justify-between gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex items-center gap-2">
                    <MessageControls
                      threadId={threadId}
                      content={part.text}
                      message={message}
                      setMessages={setMessages}
                      reload={reload}
                      stop={stop}
                    />
                    {retryWithModel && messageStats && (
                      <RetryButton 
                        onRetry={retryWithModel}
                        currentModel={messageStats.model}
                      />
                    )}
                  </div>
                  {messageStats && (
                    <MessageStats
                      model={messageStats.model}
                      duration={messageStats.duration}
                      cost={messageStats.cost}
                      tokensPerSecond={messageStats.tokensPerSecond}
                    />
                  )}
                </div>
              )}
            </div>
          );
        }
      })}
    </div>
  );
}

const PreviewMessage = memo(PureMessage, (prevProps, nextProps) => {
  if (prevProps.isStreaming !== nextProps.isStreaming) return false;
  if (prevProps.message.id !== nextProps.message.id) return false;
  if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
  return true;
});

PreviewMessage.displayName = 'PreviewMessage';

export default PreviewMessage;
