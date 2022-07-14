<script setup lang="ts">
import { schedule, teams } from "../public";
</script>

<template>
    <div class="flex h-full w-full justify-center p-4">
        <div class="flex w-4/5 max-w-3xl flex-col items-center">
            <h1 class="my-4 text-3xl">競賽直播 Stream</h1>

            <div class="w-full">
                <div
                    v-for="s in schedule"
                    class="grid w-full grid-cols-3 rounded-md border border-gray-400 p-2"
                >
                    <div class="col-span-1 flex flex-col justify-center border-r p-2">
                        <h2 class="text-xl">{{ s.id }}</h2>
                        <p>{{ s.time.toDate().toLocaleString() }}</p>
                    </div>
                    <div class="col-span-2 flex items-center justify-center p-2">
                        <p class="text-lg">{{ teams.find((t) => t.id === s.teams[0]).name }}</p>
                        <p class="mx-2">v.s.</p>
                        <p class="text-lg">{{ teams.find((t) => t.id === s.teams[1]).name }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
