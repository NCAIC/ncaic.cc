<script setup lang="ts">
import WhiteStone from "../components/WhiteStone.vue";
import BlackStone from "../components/BlackStone.vue";
const agenda = [
    ["即刻起", "報名開始"],
    ["08.17", "報名截止"],
    ["08.19", "公布賽程"],
    ["08.19", "17:30 公開抽籤"],
    ["08.20", "預賽日"],
    ["08.21", "競賽日"],
    ["08.22", "程式開源截止"],
    ["08.23", "違規檢舉截止"],
    ["08.24", "違規審議 / 寄發違規通知"],
    ["08.25", "違規申訴截止"],
    ["08.26", "競賽結果公告"],
    ["09.12", "獎項預寄日"],
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
                        'text-xl transition-all group-hover:text-2xl md:text-2xl md:group-hover:text-3xl',
                        idx % 2 === 0 ? 'pl-8' : 'pr-8',
                    ]"
                >
                    {{ schedule }}
                </div>
            </div>
        </div>
    </div>
</template>
