# 📚 Documentation System Setup Guide

## Overview

Chúng ta sẽ setup một hệ thống documentation chuyên nghiệp với:

- **VitePress** - Static site generator cho documentation
- **TypeDoc** - Tự động generate API docs từ TypeScript
- **Vue Components** - Interactive components cho examples
- **GitHub Pages** - Auto-deploy documentation

## 🚀 Quick Setup (5 phút)

### Step 1: Run Setup Script

```bash
# Chạy script tự động setup
node scripts/setup-docs.js
```

Script này sẽ:
- ✅ Tạo cấu trúc thư mục
- ✅ Install dependencies
- ✅ Tạo config files
- ✅ Tạo template documentation
- ✅ Setup Vue components

### Step 2: Start Development Server

```bash
# Khởi động docs server
pnpm docs:dev
```

Mở browser tại: http://localhost:5173

### Step 3: Generate API Documentation

```bash
# Generate API docs từ TypeScript
pnpm docs:api
```

## 📁 Cấu trúc Documentation

```
docs/
├── .vitepress/
│   ├── config.ts          # VitePress configuration
│   └── theme/            
│       ├── index.ts       # Theme customization
│       ├── style.css      # Custom styles
│       └── components/    # Vue components
├── src/                   # Documentation content
│   ├── index.md          # Homepage
│   ├── guide/            # Guides và tutorials
│   ├── packages/         # Package-specific docs
│   └── api/              # Generated API docs
└── public/               # Static assets
    ├── logo.svg
    └── favicon.ico
```

## 🎨 Customization

### 1. **Thay đổi Theme Colors**

Edit `docs/.vitepress/theme/style.css`:

```css
:root {
  --vp-c-brand-1: #3eaf7c;  /* Primary color */
  --vp-c-brand-2: #42b883;  /* Secondary color */
}
```

### 2. **Thêm Navigation Items**

Edit `docs/.vitepress/config.ts`:

```typescript
nav: [
  { text: 'Guide', link: '/guide/getting-started' },
  { text: 'Components', link: '/components/' }, // Thêm item mới
]
```

### 3. **Tạo Custom Component**

Tạo file `docs/.vitepress/theme/components/MyComponent.vue`:

```vue
<template>
  <div class="my-component">
    <slot />
  </div>
</template>

<script setup>
// Component logic
</script>

<style scoped>
.my-component {
  /* Styles */
}
</style>
```

## 📝 Writing Documentation

### Basic Markdown

```markdown
# Heading 1
## Heading 2

**Bold text** and *italic text*

- List item 1
- List item 2

[Link text](https://example.com)

![Image alt](./image.png)
```

### Code Blocks với Syntax Highlighting

````markdown
```typescript
// TypeScript code
interface User {
  id: number;
  name: string;
}
```

```bash
# Terminal commands
pnpm install
```
````

### Using Custom Components

```markdown
<PackageInfo 
  name="@matthew.ngo/storage"
  icon="🔐"
  version="1.0.0"
  status="stable"
/>

<CodePlayground 
  title="Try it out"
  code="console.log('Hello!')"
/>
```

### Tabs

```markdown
::: code-group

```js [JavaScript]
const foo = 'bar'
```

```ts [TypeScript]
const foo: string = 'bar'
```

:::
```

### Alerts và Callouts

```markdown
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::
```

## 🔧 Advanced Features

### 1. **Search Integration**

Thêm Algolia DocSearch vào `config.ts`:

```typescript
themeConfig: {
  search: {
    provider: 'algolia',
    options: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_API_KEY',
      indexName: 'YOUR_INDEX_NAME'
    }
  }
}
```

### 2. **Internationalization**

```typescript
// config.ts
export default defineConfig({
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
    vi: {
      label: 'Tiếng Việt',
      lang: 'vi',
      link: '/vi/'
    }
  }
})
```

### 3. **Custom Layouts**

Tạo custom layout trong `theme/index.ts`:

```typescript
import CustomLayout from './CustomLayout.vue'

export default {
  extends: DefaultTheme,
  Layout: CustomLayout
}
```

## 🚀 Deployment

### GitHub Pages (Automatic)

1. Push code lên GitHub
2. Enable GitHub Pages trong Settings
3. Workflow tự động deploy khi push vào main

### Manual Build

```bash
# Build documentation
pnpm docs:build

# Preview build locally
pnpm docs:preview

# Output trong docs/.vitepress/dist/
```

### Netlify/Vercel

```bash
# Build command
pnpm docs:build

# Output directory
docs/.vitepress/dist

# Node version
20.x
```

## 📊 Best Practices

### 1. **Documentation Structure**

- ✅ Start với overview/introduction
- ✅ Provide quick start guide
- ✅ Include real examples
- ✅ Document all public APIs
- ✅ Add troubleshooting section

### 2. **Writing Style**

- ✅ Use clear, concise language
- ✅ Avoid jargon
- ✅ Include code examples
- ✅ Use visuals when helpful
- ✅ Keep it up-to-date

### 3. **Interactive Examples**

```markdown
<CodePlayground>

```javascript
// Users can edit this code
const storage = createStorage();
await storage.set('key', 'value');
console.log(await storage.get('key'));
```

</CodePlayground>
```

### 4. **API Documentation**

```typescript
/**
 * Creates a new storage instance
 * @param options - Configuration options
 * @returns Storage instance
 * @example
 * ```ts
 * const storage = createStorage({
 *   type: 'local',
 *   prefix: 'app_'
 * });
 * ```
 */
export function createStorage(options?: StorageOptions): Storage {
  // Implementation
}
```

## 🐛 Troubleshooting

### Common Issues

**1. Port already in use**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**2. TypeDoc errors**
```bash
# Clear cache and rebuild
rm -rf docs/api
pnpm docs:api
```

**3. Build failures**
```bash
# Clean and rebuild
rm -rf docs/.vitepress/dist
pnpm docs:build
```

## 📚 Resources

- [VitePress Documentation](https://vitepress.dev/)
- [TypeDoc Documentation](https://typedoc.org/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Markdown Guide](https://www.markdownguide.org/)

## 🎉 Next Steps

1. **Customize homepage** - Edit `docs/src/index.md`
2. **Add your content** - Create guides in `docs/src/guide/`
3. **Document APIs** - Run `pnpm docs:api`
4. **Deploy to production** - Push to GitHub

Happy documenting! 📖