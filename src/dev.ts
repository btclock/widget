import { createApp } from 'vue';
import Widget from './Widget.vue';
import './styles/main.scss'; // Import global styles

const mountDevWidget = () => {
  const devRoot = document.getElementById('dev-root');
  if (devRoot) {
    const app = createApp(Widget);
    app.provide('Module', Module);
    app.mount(devRoot);
  }
};

mountDevWidget();

if (import.meta.hot) {
  import.meta.hot.accept('./components/Widget.vue', () => {
    mountDevWidget();
  });
}
