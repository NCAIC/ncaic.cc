<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { auth, user, initialized } from "../firebase";
import { brochure } from "../rules";
import Fade from "@c/Fade.vue";

const router = useRouter();

signed_guard();
watch(user, signed_guard);
watch(initialized, signed_guard);

const tab = ref("general");

function signed_guard() {
    if (user.value === null && initialized.value) {
        router.push("/");
    }
}
</script>

<template>
    <div v-show="user" class="flex h-full w-full justify-center p-4">
        <div class="flex w-4/5 max-w-3xl flex-col items-center">
            <h1 class="my-4 text-3xl">資訊面板 Dashboard</h1>
            <div class="flex w-full flex-col md:flex-row">
                <div class="flex flex-col border-b border-gray-400 px-2 md:border-b-0 md:border-r">
                    <button
                        :class="[
                            'mb-1 block rounded-lg border  p-2 text-left transition-all hover:bg-gray-500/20 md:w-40',
                            tab === 'general' ? 'border-gray-400' : 'border-transparent',
                        ]"
                        @click="tab = 'general'"
                    >
                        一般 General
                    </button>
                    <button
                        :class="[
                            'mb-1 block rounded-lg border  p-2 text-left transition-all hover:bg-gray-500/20 md:w-40',
                            tab === 'team' ? 'border-gray-400' : 'border-transparent',
                        ]"
                        @click="tab = 'team'"
                    >
                        隊伍 Team
                    </button>
                    <button
                        :class="[
                            'mb-1 block rounded-lg border p-2 text-left transition-all hover:bg-gray-500/20 md:w-40',
                            tab === 'code' ? 'border-gray-400' : 'border-transparent',
                        ]"
                        @click="tab = 'code'"
                    >
                        程式 Code
                    </button>
                    <button
                        :class="[
                            'mb-1 block rounded-lg border p-2 text-left transition-all hover:bg-gray-500/20 md:w-40',
                            tab === 'rule' ? 'border-gray-400' : 'border-transparent',
                        ]"
                        @click="tab = 'rule'"
                    >
                        規則 Rule
                    </button>
                </div>
                <div class="flex-1 overflow-auto p-2">
                    <Fade>
                        <div v-if="tab === 'general'">
                            <p class="text-lg">
                                {{ user?.displayName || "挑戰者" }} ({{ user?.email || "未知" }})
                            </p>

                            <button
                                class="my-2 rounded border border-gray-600 p-2 transition-all hover:border-rose-600 hover:bg-rose-500 hover:text-white"
                                @click="auth.signOut()"
                            >
                                登出 Sign Out
                            </button>
                        </div>
                        <div v-if="tab === 'team'">你目前並未加入任何隊伍。</div>
                        <div v-if="tab === 'code'">你目前並未加入任何隊伍。</div>
                        <div v-if="tab === 'rule'">
                            <h1 class="text-xl">競賽規則</h1>
                            <p class="whitespace-pre-wrap" v-html="brochure"></p>
                        </div>
                    </Fade>
                </div>
            </div>
        </div>
    </div>
</template>
