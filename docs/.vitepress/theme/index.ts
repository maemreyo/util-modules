import DefaultTheme from 'vitepress/theme';
import PackageInfo from './components/PackageInfo.vue';
import CodePlayground from './components/CodePlayground.vue';
import ApiTable from './components/ApiTable.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PackageInfo', PackageInfo);
    app.component('CodePlayground', CodePlayground);
    app.component('ApiTable', ApiTable);
  }
};