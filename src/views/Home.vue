<script setup lang="ts">
import Logo from "@c/Logo.vue";

const links = [
    { zh: "競賽報名", en: "Signup", to: "/signup" },
    { zh: "競賽日程", en: "Agenda", to: "/agenda" },
    { zh: "競賽直播", en: "Stream", to: "/stream" },
    { zh: "關於我們", en: "About", to: "/about" },
];
</script>

<template>
    <div class="h-full w-full p-4">
        <Logo class="origin-top-left lg:scale-150" />

        <div class="absolute bottom-0 right-0 grid w-80 grid-cols-2 gap-2 p-4 md:w-1/2">
            <router-link v-for="(link, i) in links" :key="i" :to="link.to">
                <div
                    class="flex h-20 flex-col items-center justify-center border border-black text-xl transition-all duration-300 hover:rounded-md hover:bg-black hover:text-white md:h-24 lg:h-28 lg:text-2xl lg:hover:rounded-2xl"
                >
                    <span>{{ link.zh }}</span> <span>{{ link.en }}</span>
                </div>
            </router-link>
        </div>
    </div>
</template>
