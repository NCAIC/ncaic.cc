<script setup lang="ts">
import { reactive, watch } from "vue";
import Logo from "@c/Logo.vue";
import { user } from "../user";

const links = reactive([
    user.value
        ? { zh: "資訊面板", en: "Dashboard", to: "/dashboard" }
        : { zh: "競賽報名", en: "Signup", to: "/signup" },
    { zh: "競賽日程", en: "Agenda", to: "/agenda" },
    { zh: "競賽直播", en: "Stream", to: "/stream" },
    { zh: "關於我們", en: "About", to: "/about" },
]);

watch(user, () => {
    if (user.value) {
        links[0].zh = "資訊面板";
        links[0].en = "Dashboard";
        links[0].to = "/dashboard";
    } else {
        links[0].zh = "競賽報名";
        links[0].en = "Signup";
        links[0].to = "/signup";
    }
});
</script>

<template>
    <div class="h-full w-full p-4">
        <Logo class="origin-top-left lg:scale-150" />

        <div class="absolute bottom-0 right-0 grid grid-cols-2 gap-2 p-4 md:gap-3 lg:gap-4">
            <router-link v-for="(link, i) in links" :key="i" :to="link.to" class="rounded-full">
                <div
                    class="flex h-36 w-36 flex-col items-center justify-center rounded-full border border-black text-xl transition-all duration-300 hover:h-40 hover:w-40 hover:bg-black hover:text-white md:hover:h-44 md:hover:w-44 lg:text-2xl"
                >
                    <span>{{ link.zh }}</span> <span>{{ link.en }}</span>
                </div>
            </router-link>
        </div>
    </div>
</template>
