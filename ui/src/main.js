import { createApp } from 'vue'
import StoreApp from './StoreApp'
import App from './App.vue'

if (window.drupalSettings && window.drupalSettings.merlb !== undefined) {
    window.drupalSettings.merlb.forEach(confPack => {
        const app = createApp(App);
        const store = new StoreApp(confPack);
        app.use(store)
        app.mount(confPack.mountPoint);
    });
} else {
    new Error("You need to provide needed layout data.");
}
