import { createApp } from 'vue'
import App from './App.vue'

if (window.drupalSettings && window.drupalSettings.plb !== undefined) {
    // Each confPack contains the mount point and the needed layout to work on.
    window.drupalSettings.plb.forEach(confPack => {
        const app = createApp(App);
        app.config.globalProperties.plb = confPack;
        app.mount(confPack.mountPoint);
    });
} else {
    // It's a single instance (for development purposes).
    console.info("Launching development version of the app");
    const app = createApp(App);
    app.mount('#plb-app')
}


