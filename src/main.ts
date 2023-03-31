import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./assets/base.css";
import App from "./App.vue";
console.log('before router')
import router from "./router";
console.log('after router')
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { version } from "/package.json";
import { VTooltip } from "floating-vue";
import "floating-vue/dist/style.css";
import "element-plus/theme-chalk/display.css";
import "./assets/b-spacing.css";
import "./assets/common.css";
import RuLocale from "element-plus/es/locale/lang/ru";
import initServices from "./services";


const app = createApp(App);

// Sentry.init({
//   app,
//   dsn: "https://1c6807c356754015927bb8fcf4c3f659@sentry.ttrace.ru/14",
//   environment: process.env['NODE_ENV'],
//   release: `tasktracker${
//     process.env['NODE_ENV'] === "production" ? "" : "-local"
//   }@${version}`,
//   integrations: [
//     new BrowserTracing({
//       routingInstrumentation: Sentry.vueRouterInstrumentation(router),
//       tracingOrigins: [
//         "vlad.dev.lan",
//         "localhost",
//         /^\//,
//         "smiapi.dev.lan",
//         "api-post.ttrace.ru",
//       ],
//       shouldCreateSpanForRequest: (url) => {
//         return (
//           url.indexOf(".dev.lan") !== -1 || url.indexOf(".ttrace.ru") !== -1
//         );
//       },
//     }),
//   ],
//   trackComponents: true,
//   tracesSampleRate: 1.0,
// });
console.log('MAIN____1')
app.directive("tooltip", VTooltip);
app.use(ElementPlus, {
  locale: RuLocale,
});
console.log('MAIN____2')
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
app.use(createPinia());
console.log('MAIN____3')
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
app.use(router);
export const services = initServices()
services.User.initMiddleware()
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount("#app");
