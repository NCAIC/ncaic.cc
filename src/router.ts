import { createWebHistory, createRouter } from "vue-router";

const history = createWebHistory();

const routes = [
    { path: "/", name: "home", component: () => import("./views/Home.vue") },
    { path: "/agenda", name: "agenda", component: () => import("./views/Agenda.vue") },
    { path: "/stream", name: "stream", component: () => import("./views/Stream.vue") },
    { path: "/signup", name: "signup", component: () => import("./views/Signup.vue") },
    { path: "/about", name: "about", component: () => import("./views/About.vue") },
    { path: "/dashboard", name: "dashboard", component: () => import("./views/Dashboard.vue") },
    { path: "/:catchAll(.*)*", redirect: "/" },
];

export const router = createRouter({
    history,
    routes,
    scrollBehavior() {
        // always scroll to top
        return { top: 0 };
    },
});
