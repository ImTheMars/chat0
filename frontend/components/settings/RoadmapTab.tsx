import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle2, Circle, Clock, Zap } from 'lucide-react';

export default function RoadmapTab() {
  const roadmapItems = [
    {
      id: 1,
      title: 'Enhanced Model Management',
      description: 'Advanced model comparison, custom model configurations, and model performance analytics',
      status: 'completed',
      category: 'Core Features',
    },
    {
      id: 2,
      title: 'Conversation Templates',
      description: 'Pre-built conversation templates for different use cases like coding, writing, and analysis',
      status: 'in-progress',
      category: 'Productivity',
    },
    {
      id: 3,
      title: 'Team Collaboration',
      description: 'Share conversations, collaborate on chats, and team workspace features',
      status: 'planned',
      category: 'Collaboration',
    },
    {
      id: 4,
      title: 'Advanced Search & Filtering',
      description: 'Search through conversation history, filter by models, dates, and content types',
      status: 'planned',
      category: 'Core Features',
    },
    {
      id: 5,
      title: 'Custom Integrations',
      description: 'API access, webhook support, and integrations with popular development tools',
      status: 'planned',
      category: 'Integrations',
    },
    {
      id: 6,
      title: 'Voice & Audio Support',
      description: 'Voice input, audio output, and conversation recording capabilities',
      status: 'planned',
      category: 'Media',
    },
    {
      id: 7,
      title: 'Mobile Application',
      description: 'Native mobile apps for iOS and Android with full feature parity',
      status: 'planned',
      category: 'Platform',
    },
    {
      id: 8,
      title: 'Advanced Analytics',
      description: 'Usage analytics, conversation insights, and productivity metrics',
      status: 'planned',
      category: 'Analytics',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'planned':
        return <Circle className="h-4 w-4 text-gray-400" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">In Progress</Badge>;
      case 'planned':
        return <Badge variant="secondary">Planned</Badge>;
      default:
        return <Badge variant="secondary">Planned</Badge>;
    }
  };

  const groupedItems = roadmapItems.reduce((acc, item) => {
    if (!acc[item.status]) {
      acc[item.status] = [];
    }
    acc[item.status].push(item);
    return acc;
  }, {} as Record<string, typeof roadmapItems>);

  const statusOrder = ['completed', 'in-progress', 'planned'];
  const statusTitles = {
    'completed': 'Recently Completed',
    'in-progress': 'Currently In Progress',
    'planned': 'Planned Features',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Zap className="h-6 w-6 text-primary" />
        <div>
          <h3 className="text-lg font-medium">Product Roadmap</h3>
          <p className="text-sm text-muted-foreground">
            Discover what's coming next and what we're currently working on
          </p>
        </div>
      </div>

      {statusOrder.map((status) => {
        const items = groupedItems[status] || [];
        if (items.length === 0) return null;

        return (
          <div key={status} className="space-y-4">
            <h4 className="text-base font-medium text-foreground">
              {statusTitles[status as keyof typeof statusTitles]}
            </h4>
            <div className="grid gap-4">
              {items.map((item) => (
                <Card key={item.id} className="transition-all hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <CardTitle className="text-base">{item.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Have a Feature Request?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We're always looking to improve Chat0 based on user feedback. If you have ideas for new features or improvements, 
            feel free to reach out to us through our feedback channels.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 