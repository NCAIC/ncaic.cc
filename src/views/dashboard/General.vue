<script setup lang="ts">
import { user, sign_out } from "../../composables/core";

const resources = {
    "加入 Discord 伺服器": "https://discord.gg/TsrrWAXaMT",
    "NCAIC 報名與使用手冊": "https://hackmd.io/@NCAIC/guide",
    "GitHub Repository 模板": "https://github.com/NCAIC/NCAIC-2022-Template/generate",
    "透過 contact@ncaic.cc 聯絡我們":
        "https://mail.google.com/mail/?to=contact@ncaic.cc&su=[%E8%A9%A2%E5%95%8F]%20&body=%E6%88%91%E6%83%B3%E8%A9%A2%E5%95%8F...&tf=cm",
};
</script>

<template>
    <div>
        <p class="text-lg">
            嗨，{{ user?.providerData[0].displayName || "無名氏" }}
            <span class="text-slate-500">({{ user?.providerData[0].email || "無電子郵件" }}) </span>
        </p>

        <div class="my-2 rounded border p-2">
            <h2 class="mb-2 text-xl">競賽資源</h2>
            <ul>
                <li v-for="(url, title) in resources" class="mb-2">
                    <a
                        class="ml-4 text-blue-500 transition-all after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-sm after:bg-indigo-400 after:transition-all after:content-[''] hover:text-indigo-500 hover:after:w-full"
                        :href="url"
                        target="_blank"
                    >
                        {{ title }}
                    </a>
                </li>
            </ul>
        </div>

        <button
            class="my-2 rounded border border-slate-600 p-2 transition-all hover:border-rose-600 hover:bg-rose-500 hover:text-white"
            @click="sign_out"
        >
            登出 Sign Out
        </button>
    </div>
</template>
