<script setup lang="ts">
import gsap from "gsap";
import WhiteStone from "@c/WhiteStone.vue";
import BlackStone from "@c/BlackStone.vue";
import { onMounted } from "vue";

const whites = [
    [
        { left: "10%", top: "10%" },
        { left: "10%", top: "40%" },
    ],
    [
        { right: "10%", bottom: "10%" },
        { right: "10%", bottom: "40%" },
    ],
];

const blacks = [
    [
        { right: "20%", top: "30%" },
        { right: "20%", top: "60%" },
    ],
    [
        { left: "20%", bottom: "30%" },
        { left: "20%", bottom: "60%" },
    ],
];

onMounted(() => {
    for (let i = 0; i < whites.length; i++) {
        gsap.fromTo(
            `#white-stone-${i}`,
            { ...whites[i][0] },
            { duration: 5, repeat: -1, yoyo: true, ease: "back.inOut(1.7)", ...whites[i][1] },
        );
    }
    for (let i = 0; i < blacks.length; i++) {
        gsap.fromTo(
            `#black-stone-${i}`,
            { ...blacks[i][0] },
            { duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut", ...blacks[i][1] },
        );
    }
});
</script>

<template>
    <div class="fixed h-full w-full opacity-30">
        <BlackStone
            v-for="(black, i) in blacks"
            :key="i"
            :id="`black-stone-${i}`"
            class="absolute"
        />
        <WhiteStone
            v-for="(white, i) in whites"
            :key="i"
            :id="`white-stone-${i}`"
            class="absolute"
        />
    </div>
</template>
