import { UIMessage } from 'ai';
import Dexie, { type EntityTable } from 'dexie';

interface Thread {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
}

interface MessageStats {
  startTime: number;
  model: string;
  cost: number;
  tokens: number;
  duration: number;
  tokensPerSecond: number;
}

interface DBMessage {
  id: string;
  threadId: string;
  parts: UIMessage['parts'];
  content: string;
  role: 'user' | 'assistant' | 'system' | 'data';
  createdAt: Date;
  stats?: MessageStats;
}

interface MessageSummary {
  id: string;
  threadId: string;
  messageId: string;
  content: string;
  createdAt: Date;
}

const db = new Dexie('chat0') as Dexie & {
  threads: EntityTable<Thread, 'id'>;
  messages: EntityTable<DBMessage, 'id'>;
  messageSummaries: EntityTable<MessageSummary, 'id'>;
};

db.version(1).stores({
  threads: 'id, title, updatedAt, lastMessageAt',
  messages: 'id, threadId, createdAt, [threadId+createdAt], content',
  messageSummaries: 'id, threadId, messageId, createdAt, [threadId+createdAt]',
});

// Add the new stats field to messages in version 2
db.version(2).stores({
  threads: 'id, title, updatedAt, lastMessageAt',
  messages: 'id, threadId, createdAt, [threadId+createdAt], content, stats',
  messageSummaries: 'id, threadId, messageId, createdAt, [threadId+createdAt]',
});

export type { Thread, DBMessage, MessageStats };
export { db };
