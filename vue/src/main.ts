import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "@/App.vue";
import router from "./router";

import "@/assets/style/tailwind.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount(document.getElementById("root")!);
