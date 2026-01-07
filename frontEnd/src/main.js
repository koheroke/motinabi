import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/router"; // 1で作ったファイルをインポート

const app = createApp(App);

app.use(router); // Routerを登録
app.mount("#app");
