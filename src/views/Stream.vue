<script setup lang="ts">
import { schedules, teams } from "../composables/core";
</script>

<template>
    <div class="flex h-full w-full justify-center p-4">
        <div class="flex w-4/5 max-w-3xl flex-col items-center">
            <h1 class="my-4 text-3xl">競賽直播 Stream</h1>

            <div class="w-full">
                <div
                    v-for="s in schedules"
                    class="mb-4 grid w-full grid-cols-1 rounded-md border border-gray-400 p-2 lg:grid-cols-3"
                >
                    <div
                        class="col-span-1 flex flex-row justify-around border-b p-2 lg:flex-col lg:justify-center lg:border-b-0 lg:border-r"
                    >
                        <div>
                            <h2 class="text-xl">{{ s.id }}</h2>
                            <p>{{ s.time.toDate().toLocaleString() }}</p>
                        </div>
                        <div>
                            <p class="text-sm">{{ s.rule.matches.length }} 局 {{ s.rule.rule }}</p>
                            <p class="text-sm text-gray-500">
                                {{
                                    s.rule.matches
                                        .map((m) => m.type + (m.count ? "-" + m.count : ""))
                                        .join(", ")
                                }}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center justify-center p-2 lg:col-span-2">
                        <p class="text-lg">
                            {{ teams.find((t) => t.id === s.teams[0])?.name || "無隊伍資訊" }}
                        </p>
                        <p class="px-2">v.s.</p>
                        <p class="text-lg">
                            {{ teams.find((t) => t.id === s.teams[1])?.name || "無隊伍資訊" }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
