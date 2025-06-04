import { h } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './style.css';

// Import custom components
import PackageInfo from './components/PackageInfo.vue';
import CodePlayground from './components/CodePlayground.vue';
import ApiTable from './components/ApiTable.vue';

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // Custom slots for layout customization
      // 'home-hero-before': () => h('div', 'Custom hero content'),
      // 'home-features-after': () => h('div', 'Custom features content'),
    });
  },
  enhanceApp({ app, router, siteData }) {
    // Register custom components globally
    app.component('PackageInfo', PackageInfo);
    app.component('CodePlayground', CodePlayground);
    app.component('ApiTable', ApiTable);
    
    // Add custom directives
    app.directive('focus', {
      mounted: (el) => el.focus()
    });
    
    // Track page views (optional)
    router.onAfterRouteChanged = (to) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'GA_MEASUREMENT_ID', {
          page_path: to,
        });
      }
    };
  }
} satisfies Theme;