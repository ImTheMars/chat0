import Chat from '@/frontend/components/Chat';
import { useParams } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { getMessagesByThreadId } from '../dexie/queries';
import { type DBMessage } from '../dexie/db';
import { UIMessage } from 'ai';

// Extend UIMessage to include stats
export interface UIMessageWithStats extends UIMessage {
  stats?: {
    startTime: number;
    model: string;
    cost: number;
    tokens: number;
    duration: number;
    tokensPerSecond: number;
  };
}

export default function Thread() {
  const { id } = useParams();
  if (!id) throw new Error('Thread ID is required');

  const messages = useLiveQuery(() => getMessagesByThreadId(id), [id]);

  const convertToUIMessages = (messages?: DBMessage[]): UIMessageWithStats[] => {
    return messages?.map((message) => ({
      id: message.id,
      role: message.role,
      parts: message.parts as UIMessage['parts'],
      content: message.content || '',
      createdAt: message.createdAt,
      stats: message.stats,
    })) || [];
  };

  return (
    <Chat
      key={id}
      threadId={id}
      initialMessages={convertToUIMessages(messages)}
    />
  );
}
