# Chrome Storage

<PackageInfo 
  name="@matthew.ngo/storage"
  icon="🔐"
  version="1.0.0"
  status="stable"
/>

## Overview

The Chrome Storage module provides a robust and type-safe wrapper around Chrome's storage APIs with additional features like encryption, compression, and migration support.

## Features

- 🔐 **Encryption Support** - Secure your sensitive data
- 🗜️ **Compression** - Reduce storage usage automatically
- 🔄 **Sync Storage** - Seamlessly sync across devices
- 📊 **Storage Analytics** - Monitor usage and performance
- 🔀 **Migration Tools** - Upgrade storage schemas safely
- 🎯 **TypeScript First** - Full type safety and IntelliSense

## Installation

::: code-group
```bash [pnpm]
pnpm add @matthew.ngo/storage
```

```bash [npm]
npm install @matthew.ngo/storage
```

```bash [yarn]
yarn add @matthew.ngo/storage
```
:::

## Quick Start

```typescript
import { createStorage } from '@matthew.ngo/storage';

// Create a storage instance with encryption
const storage = createStorage({
  type: 'local',
  prefix: 'myapp_',
  encryption: {
    enabled: true,
    key: process.env.ENCRYPTION_KEY
  }
});

// Store encrypted data
await storage.set('user', { 
  id: 123, 
  name: 'John Doe' 
});

// Retrieve and decrypt automatically
const user = await storage.get('user');
```

## Next Steps

- [Installation Guide](./installation)
- [Basic Usage](./usage)
- [API Reference](./api)
- [Examples](./examples/basic)
