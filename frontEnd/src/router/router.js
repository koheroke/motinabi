import { createRouter, createWebHistory } from "vue-router";
import createItemListWindow from "../windows/createItemListWindow.vue";
const routes = [
  {
    path: "/",
    name: "createItemListWindow",
    component: createItemListWindow,
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;
