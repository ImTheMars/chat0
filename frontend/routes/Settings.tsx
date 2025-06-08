import { Link } from 'react-router';
import { buttonVariants } from '../components/ui/button';
import { ArrowLeftIcon, Key, Zap, Settings as SettingsIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import APIKeysTab from '../components/settings/APIKeysTab';
import ModelsTab from '../components/settings/ModelsTab';
import RoadmapTab from '../components/settings/RoadmapTab';

export default function Settings() {
  return (
    <section className="flex w-full h-full bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
          <Link
            to="/chat"
            className={buttonVariants({
              variant: 'outline',
              size: 'sm',
            })}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Chat
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-20">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <Tabs defaultValue="api-keys" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="api-keys" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="models" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Models
              </TabsTrigger>
              <TabsTrigger value="roadmap" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                Roadmap
              </TabsTrigger>
            </TabsList>

            <TabsContent value="api-keys" className="space-y-6">
              <APIKeysTab />
            </TabsContent>

            <TabsContent value="models" className="space-y-6">
              <ModelsTab />
            </TabsContent>

            <TabsContent value="roadmap" className="space-y-6">
              <RoadmapTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
