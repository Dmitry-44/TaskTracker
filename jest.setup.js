import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { createApp } from "vue";
import App from "./src/App.vue"
// import ru from "element-plus/es/locale/lang/ru";
const key = Symbol()
const app = createApp(App);
// Vue.config.productionTip = false;
app.use(ElementPlus, key);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}