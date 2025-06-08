import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const headersList = await headers();
  const googleApiKey = headersList.get('X-Google-API-Key');
  const openaiApiKey = headersList.get('X-OpenAI-API-Key');
  const openrouterApiKey = headersList.get('X-OpenRouter-API-Key');
  const modelProvider = headersList.get('X-Model-Provider');

  let provider;
  let model;

  switch (modelProvider) {
    case 'google':
      if (!googleApiKey) {
        return NextResponse.json(
          {
            error: 'Google API key is required.',
          },
          { status: 400 }
        );
      }
      provider = createGoogleGenerativeAI({
        apiKey: googleApiKey,
      });
      model = 'gemini-1.5-flash-latest';
      break;
    case 'openai':
      if (!openaiApiKey) {
        return NextResponse.json(
          {
            error: 'OpenAI API key is required.',
          },
          { status: 400 }
        );
      }
      provider = createOpenAI({
        apiKey: openaiApiKey,
      });
      model = 'gpt-4o-mini';
      break;
    case 'openrouter':
      if (!openrouterApiKey) {
        return NextResponse.json(
          {
            error: 'OpenRouter API key is required.',
          },
          { status: 400 }
        );
      }
      provider = createOpenRouter({
        apiKey: openrouterApiKey,
      });
      model = 'deepseek/deepseek-v2-chat';
      break;
    default:
      return NextResponse.json(
        {
          error: 'Invalid model provider.',
        },
        { status: 400 }
      );
  }

  const { prompt, isTitle, messageId, threadId } = await req.json();

  try {
    const { text: title } = await generateText({
      model: provider(model),
      system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - you should NOT answer the user's message, you should only generate a summary/title
      - do not use quotes or colons`,
      prompt,
    });

    return NextResponse.json({ title, isTitle, messageId, threadId });
  } catch (error) {
    console.error('Failed to generate title:', error);
    return NextResponse.json(
      { error: 'Failed to generate title' },
      { status: 500 }
    );
  }
}
