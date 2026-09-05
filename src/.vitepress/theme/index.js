import DefaultTheme from 'vitepress/theme'

import PluginRegistry from './components/PluginRegistry.vue'

// Registered globally so any Markdown page can drop <PluginRegistry /> in
// without an import block of its own.
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PluginRegistry', PluginRegistry)
  },
}
