<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import Logo from "@c/Logo.vue";
import Fade from "@c/Fade.vue";
import { announcements, user } from "../composables/core";

const pinned = computed(() => announcements.filter((n) => n.pinned).slice(0, 3));

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
    <div class="h-full w-full overflow-y-auto">
        <div class="h-full w-full overflow-hidden p-4">
            <Logo class="origin-top-left lg:scale-150" />

            <Fade>
                <div class="my-2 text-lg lg:translate-y-12" v-if="pinned.length">
                    <a v-for="news in pinned" :key="news.title" class="mb-2 block" href="#news">
                        <span class="inline-block border-l-4 border-l-gray-400 px-2">{{
                            news.time.toDate().toLocaleDateString()
                        }}</span>
                        <span class="px-2">{{ news.title }}</span>
                        <span
                            class="text-gray-500"
                            v-html="
                                news.content.slice(0, 20) + (news.content.length > 20 ? '...' : '')
                            "
                        ></span>
                    </a>
                </div>
            </Fade>

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
        <div class="h-full w-full overflow-hidden p-4">
            <h2 id="news" class="text-3xl">公告</h2>
            <Fade>
                <div class="my-2 text-lg" v-if="announcements.length">
                    <div
                        v-for="n in announcements"
                        :key="n.title"
                        class="mb-2 border-l-4 border-l-gray-400 p-2"
                    >
                        <span class="inline-block pr-2">
                            {{ n.time.toDate().toLocaleString() }}
                        </span>
                        <span class="px-2">{{ n.title }}</span>
                        <div class="overflow-auto text-gray-700" v-html="n.content"></div>
                    </div>
                </div>
            </Fade>
        </div>
    </div>
</template>
