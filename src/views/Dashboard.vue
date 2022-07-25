<script setup lang="ts">
import { ref, watch, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { user, stage } from "../composables/core";
import Fade from "@c/Fade.vue";

const General = defineAsyncComponent(() => import("@v/dashboard/General.vue"));
const Team = defineAsyncComponent(() => import("@v/dashboard/Team.vue"));
const Code = defineAsyncComponent(() => import("@v/dashboard/Code.vue"));
const Rule = defineAsyncComponent(() => import("@v/dashboard/Rule.vue"));

const router = useRouter();

signed_guard();
watch(user, signed_guard);
watch(stage, signed_guard);

const tab = ref("general");

async function signed_guard() {
    if (user.value === null && stage.value >= 2) {
        router.push("/");
    }
}
</script>

<template>
    <div v-show="user" class="flex h-full w-full justify-center p-4">
        <div class="flex w-4/5 max-w-3xl flex-col items-center">
            <h1 class="my-4 text-3xl">資訊面板 Dashboard</h1>
            <div class="flex w-full flex-col md:flex-row">
                <div class="flex flex-col border-b border-slate-400 px-2 md:border-b-0 md:border-r">
                    <button
                        :class="[
                            'mb-1 block rounded-lg border  p-2 text-left transition-all hover:bg-slate-500/20 md:w-40',
                            tab === 'general' ? 'border-slate-400' : 'border-transparent',
                        ]"
                        @click="tab = 'general'"
                    >
                        一般 General
                    </button>
                    <button
                        :class="[
                            'mb-1 block rounded-lg border  p-2 text-left transition-all hover:bg-slate-500/20 md:w-40',
                            tab === 'team' ? 'border-slate-400' : 'border-transparent',
                        ]"
                        @click="tab = 'team'"
                    >
                        隊伍 Team
                    </button>
                    <button
                        :class="[
                            'mb-1 block rounded-lg border p-2 text-left transition-all hover:bg-slate-500/20 md:w-40',
                            tab === 'code' ? 'border-slate-400' : 'border-transparent',
                        ]"
                        @click="tab = 'code'"
                    >
                        程式 Code
                    </button>
                    <button
                        :class="[
                            'mb-1 block rounded-lg border p-2 text-left transition-all hover:bg-slate-500/20 md:w-40',
                            tab === 'rule' ? 'border-slate-400' : 'border-transparent',
                        ]"
                        @click="tab = 'rule'"
                    >
                        規則 Rule
                    </button>
                </div>
                <div class="flex-1 overflow-auto p-2">
                    <Fade>
                        <General v-if="tab === 'general'" />
                        <Team v-if="tab === 'team'" class="w-full" />
                        <Code v-if="tab === 'code'" class="w-full" />
                        <Rule v-if="tab === 'rule'" />
                    </Fade>
                </div>
            </div>
        </div>
        <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.5.1/build/styles/default.min.css"
        />
    </div>
</template>
