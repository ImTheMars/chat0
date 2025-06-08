import React, { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, useForm, UseFormRegister } from 'react-hook-form';

import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/frontend/components/ui/card';
import { Key, Plus, X, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

const formSchema = z.object({
  google: z.string().trim().optional(),
  openrouter: z.string().trim().optional(),
  openai: z.string().trim().optional(),
  anthropic: z.string().trim().optional(),
  deepseek: z.string().trim().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function APIKeyForm() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <Key className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">API Configuration</h2>
        <p className="text-muted-foreground mt-2">
          Add your API keys to start chatting with AI models. All keys are stored securely in your browser.
        </p>
      </div>
      
      <Form />
    </div>
  );
}

const Form = () => {
  const { keys, setKeys, customModels, addCustomModel, removeCustomModel } = useAPIKeyStore();
  const [newCustomModel, setNewCustomModel] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: keys,
  });

  const watchedKeys = watch();

  useEffect(() => {
    reset(keys);
  }, [keys, reset]);

  const onSubmit = useCallback(
    (values: FormValues) => {
      setKeys(values);
      toast.success('API keys saved successfully');
    },
    [setKeys]
  );

  const validateKey = (provider: string, key: string) => {
    if (!key) return null;
    
    const validationRules = {
      google: key.startsWith('AIza'),
      openai: key.startsWith('sk-'),
      openrouter: key.startsWith('sk-or-'),
      anthropic: key.startsWith('sk-ant-'),
      deepseek: key.length > 0, // DeepSeek keys vary
    };

    return validationRules[provider as keyof typeof validationRules];
  };

  const getProviderStatus = (provider: string, key: string) => {
    if (!key) return 'empty';
    return validateKey(provider, key) ? 'valid' : 'invalid';
  };

  const handleAddCustomModel = () => {
    if (newCustomModel.trim()) {
      addCustomModel('openrouter', newCustomModel.trim());
      setNewCustomModel('');
      toast.success('Custom model added');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6">
        <ProviderSection
          id="openai"
          name="OpenAI"
          description="Access to GPT models, o-series reasoning models, and DALL-E"
          placeholder="sk-proj-..."
          linkUrl="https://platform.openai.com/settings/organization/api-keys"
          models={['GPT-4o', 'GPT-4.1 mini', 'o1-mini', 'o3-mini']}
          register={register}
          error={errors.openai}
          status={getProviderStatus('openai', watchedKeys.openai || '')}
          icon="🤖"
        />

        <ProviderSection
          id="google"
          name="Google AI"
          description="Gemini models with multimodal capabilities and large context windows"
          placeholder="AIza..."
          linkUrl="https://aistudio.google.com/apikey"
          models={['Gemini 2.5 Flash', 'Gemini 2.5 Pro', 'Gemini 2.0 Flash']}
          register={register}
          error={errors.google}
          status={getProviderStatus('google', watchedKeys.google || '')}
          icon="🔍"
        />

        <ProviderSection
          id="anthropic"
          name="Anthropic"
          description="Claude models known for helpful, harmless, and honest responses"
          placeholder="sk-ant-..."
          linkUrl="https://console.anthropic.com/settings/keys"
          models={['Claude Sonnet 3.5', 'Claude Opus 4', 'Claude Haiku 3.5']}
          register={register}
          error={errors.anthropic}
          status={getProviderStatus('anthropic', watchedKeys.anthropic || '')}
          icon="🧠"
        />

        <div>
          <ProviderSection
            id="openrouter"
            name="OpenRouter"
            description="Access to Claude, DeepSeek, Mistral, and many other third-party models"
            placeholder="sk-or-..."
            linkUrl="https://openrouter.ai/settings/keys"
            models={['Claude Sonnet 3.5', 'DeepSeek-V3', 'Mistral Large']}
            register={register}
            error={errors.openrouter}
            status={getProviderStatus('openrouter', watchedKeys.openrouter || '')}
            icon="🔄"
          />
          
          {watchedKeys.openrouter && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">Custom OpenRouter Models</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Add custom model codes from OpenRouter's model list to access additional models.
              </p>
              
              <div className="flex gap-2 mb-3">
                <Input
                  value={newCustomModel}
                  onChange={(e) => setNewCustomModel(e.target.value)}
                  placeholder="e.g., anthropic/claude-3.5-sonnet"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomModel}
                  disabled={!newCustomModel.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {customModels.openrouter.length > 0 && (
                <div className="space-y-2">
                  {customModels.openrouter.map((model) => (
                    <div key={model} className="flex items-center justify-between p-2 bg-background rounded border">
                      <span className="text-sm font-mono">{model}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomModel('openrouter', model)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <ProviderSection
          id="deepseek"
          name="DeepSeek"
          description="Advanced reasoning models specialized in coding and mathematics"
          placeholder="sk-..."
          linkUrl="https://platform.deepseek.com/api_keys"
          models={['DeepSeek-V3', 'DeepSeek-R1']}
          register={register}
          error={errors.deepseek}
          status={getProviderStatus('deepseek', watchedKeys.deepseek || '')}
          icon="🔬"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={!isDirty}>
          <Key className="h-4 w-4 mr-2" />
          Save API Keys
        </Button>
      </div>
    </form>
  );
};

interface ApiKeyFieldProps {
  id: string;
  label: string;
  linkUrl: string;
  models: string[];
  placeholder: string;
  error?: FieldError | undefined;
  required?: boolean;
  register: UseFormRegister<FormValues>;
}

const ApiKeyField = ({
  id,
  label,
  linkUrl,
  placeholder,
  models,
  error,
  required,
  register,
}: ApiKeyFieldProps) => (
  <div className="flex flex-col gap-2">
    <label
      htmlFor={id}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex gap-1"
    >
      <span>{label}</span>
    </label>
    <div className="flex gap-2">
      {models.map((model) => (
        <Badge key={model}>{model}</Badge>
      ))}
    </div>

    <Input
      id={id}
      placeholder={placeholder}
      {...register(id as keyof FormValues)}
      className={error ? 'border-red-500' : ''}
    />

    <a
      href={linkUrl}
      target="_blank"
      className="text-sm text-blue-500 inline w-fit"
    >
      Create {label.split(' ')[0]} API Key
    </a>

    {error && (
      <p className="text-[0.8rem] font-medium text-red-500">{error.message}</p>
    )}
  </div>
);

type ProviderSectionProps = {
  id: keyof FormValues;
  name: string;
  description: string;
  placeholder: string;
  linkUrl: string;
  models: string[];
  register: UseFormRegister<FormValues>;
  error?: FieldError;
  status: 'empty' | 'valid' | 'invalid';
  icon: string;
};

const ProviderSection: React.FC<ProviderSectionProps> = ({
  id,
  name,
  description,
  placeholder,
  linkUrl,
  models,
  register,
  error,
  status,
  icon,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'valid':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Key className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'valid':
        return 'border-green-200 bg-green-50';
      case 'invalid':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-border bg-background';
    }
  };

  return (
    <Card className={`transition-colors ${getStatusColor()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{icon}</span>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription className="text-sm">{description}</CardDescription>
            </div>
          </div>
          {getStatusIcon()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            id={id}
            type="password"
            placeholder={placeholder}
            {...register(id)}
            className={error ? 'border-red-500' : ''}
          />
          {error && (
            <p className="text-sm text-red-500">{error.message}</p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1">
          {models.map((model) => (
            <Badge key={model} variant="secondary" className="text-xs">
              {model}
            </Badge>
          ))}
        </div>
        
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
        >
          Get your API key
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
};
