<script setup lang="ts">
import WhiteStone from "../components/WhiteStone.vue";
import BlackStone from "../components/BlackStone.vue";
const agenda = [
    ["07.12", "我不知道要幹嘛"],
    ["07.13", "我不知道要幹嘛"],
    ["07.14", "我不知道要幹嘛"],
    ["07.15", "我不知道要幹嘛"],
    ["07.16", "我不知道要幹嘛"],
    ["07.17", "我不知道要幹嘛"],
    ["07.18", "我不知道要幹嘛"],
    ["07.19", "我不知道要幹嘛"],
    ["07.20", "我不知道要幹嘛"],
    ["07.21", "我不知道要幹嘛"],
];
</script>

<template>
    <div class="flex h-full w-full justify-center p-4">
        <div class="flex w-4/5 max-w-3xl flex-col items-center">
            <h1 class="my-4 text-3xl">競賽日程 Agenda</h1>
            <div
                v-for="([date, schedule], idx) in agenda"
                :class="[
                    'group flex h-40 w-full items-center py-4',
                    idx % 2 === 0 ? ' flex-row' : 'flex-row-reverse',
                ]"
            >
                <WhiteStone
                    v-if="idx % 2 === 0"
                    class="flex h-28 w-28 items-center justify-center text-2xl transition-all group-hover:h-36 group-hover:w-36 lg:h-32 lg:w-32"
                >
                    {{ date }}
                </WhiteStone>
                <BlackStone
                    v-else
                    class="flex h-28 w-28 items-center justify-center text-2xl transition-all group-hover:h-36 group-hover:w-36 lg:h-32 lg:w-32"
                >
                    {{ date }}
                </BlackStone>
                <div
                    :class="[
                        'text-2xl transition-all group-hover:text-3xl',
                        idx % 2 === 0 ? 'pl-8' : 'pr-8',
                    ]"
                >
                    {{ schedule }}
                </div>
            </div>
        </div>
    </div>
</template>
