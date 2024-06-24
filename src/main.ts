import { createApp } from 'vue'
import './styles/main.scss';
import Widget from './Widget.vue'

const mountWidget = () => {
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'btclock-widget';
    document.body.appendChild(widgetContainer);
  
    const app = createApp(Widget);
    app.provide('Module', Module);

    app.mount('#btclock-widget');
  };
  
  // Export the mount function to be used when the script is included
  (window as any).mountWidget = mountWidget;