# AI Toolkit

<PackageInfo 
  name="@matthew.ngo/ai-toolkit"
  icon="🤖"
  version="1.0.0"
  status="stable"
/>

## Overview

The AI Toolkit provides a unified interface for working with multiple AI providers including OpenAI, Anthropic, Google AI, and more. Built with performance and developer experience in mind.

## Features

- 🔌 **Multi-Provider Support** - OpenAI, Anthropic, Google, and more
- 💾 **Smart Caching** - Reduce API calls and costs
- ⚡ **Streaming Support** - Real-time responses
- 🔒 **Rate Limiting** - Prevent API quota issues
- 🎯 **Type Safe** - Full TypeScript support
- 📊 **Usage Analytics** - Track costs and performance

## Supported Providers

<div class="feature-grid">
  <div class="feature-card">
    <h3>OpenAI</h3>
    <p>GPT-4, GPT-3.5, DALL-E, Whisper</p>
  </div>
  <div class="feature-card">
    <h3>Anthropic</h3>
    <p>Claude 3, Claude 2, Claude Instant</p>
  </div>
  <div class="feature-card">
    <h3>Google AI</h3>
    <p>Gemini Pro, PaLM 2</p>
  </div>
  <div class="feature-card">
    <h3>Custom</h3>
    <p>Bring your own provider</p>
  </div>
</div>

## Quick Start

```typescript
import { createAI } from '@matthew.ngo/ai-toolkit';

// Initialize with your preferred provider
const ai = createAI({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  cache: {
    enabled: true,
    ttl: 3600 // 1 hour
  }
});

// Generate text
const response = await ai.complete({
  prompt: 'Write a haiku about programming',
  model: 'gpt-4',
  temperature: 0.7
});

console.log(response.text);
```

## Next Steps

- [Installation](./installation)
- [Configuration](./configuration)
- [Provider Guides](./providers/openai)
- [API Reference](./api)
