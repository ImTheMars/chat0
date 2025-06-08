import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
} from '@/frontend/components/ui/sidebar';
import { Button, buttonVariants } from './ui/button';
import {
  deleteThread,
  getThreads,
  searchMessages,
  updateThread,
} from '@/frontend/dexie/queries';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link, useNavigate, useParams } from 'react-router';
import { X, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { memo, useState } from 'react';
import { Input } from './ui/input';

export default function ChatSidebar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const threads = useLiveQuery(() => getThreads(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const searchResults = useLiveQuery(
    () => searchMessages(searchQuery),
    [searchQuery]
  );

  return (
    <Sidebar>
      <div className="flex flex-col h-full p-2">
        <Header />
        <div className="px-2 py-4">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <SidebarContent className="no-scrollbar">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {searchQuery
                  ? searchResults?.map((message) => {
                      return (
                        <SidebarMenuItem
                          key={message.id}
                          onClick={() => {
                            navigate(`/chat/${message.threadId}`);
                          }}
                        >
                          <div
                            className={cn(
                              'cursor-pointer group/thread h-9 flex items-center px-2 py-1 rounded-[8px] overflow-hidden w-full hover:bg-secondary'
                            )}
                          >
                            <span className="truncate block">
                              {message.content}
                            </span>
                          </div>
                        </SidebarMenuItem>
                      );
                    })
                  : threads?.map((thread) => {
                      return (
                        <SidebarMenuItem key={thread.id}>
                          <div
                            className={cn(
                              'cursor-pointer group/thread h-9 flex items-center px-2 py-1 rounded-[8px] overflow-hidden w-full hover:bg-secondary',
                              id === thread.id && 'bg-secondary'
                            )}
                            onClick={() => {
                              if (id === thread.id) {
                                return;
                              }
                              navigate(`/chat/${thread.id}`);
                            }}
                          >
                            {editingThreadId === thread.id ? (
                              <Input
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onBlur={() => {
                                  updateThread(thread.id, editingTitle);
                                  setEditingThreadId(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    updateThread(thread.id, editingTitle);
                                    setEditingThreadId(null);
                                  }
                                }}
                                autoFocus
                                className="h-7"
                              />
                            ) : (
                              <span className="truncate block">
                                {thread.title}
                              </span>
                            )}
                            <div className="hidden group-hover/thread:flex ml-auto">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingThreadId(thread.id);
                                  setEditingTitle(thread.title);
                                }}
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={async (event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  await deleteThread(thread.id);
                                  navigate(`/chat`);
                                }}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        </SidebarMenuItem>
                      );
                    })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <Footer />
      </div>
    </Sidebar>
  );
}

function PureHeader() {
  return (
    <SidebarHeader className="flex justify-between items-center gap-4 relative">
      <SidebarTrigger className="absolute right-1 top-2.5" />
      <h1 className="text-2xl font-bold">
        Chat<span className="">0</span>
      </h1>
      <Link
        to="/chat"
        className={buttonVariants({
          variant: 'default',
          className: 'w-full',
        })}
      >
        New Chat
      </Link>
    </SidebarHeader>
  );
}

const Header = memo(PureHeader);

const PureFooter = () => {
  return (
    <SidebarFooter>
      <Link to="/settings" className={buttonVariants({ variant: 'outline' })}>
        Settings
      </Link>
    </SidebarFooter>
  );
};

const Footer = memo(PureFooter);
