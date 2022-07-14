<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import Fade from "@c/Fade.vue";

const BackGround = defineAsyncComponent(() => import("@c/BackGround.vue"));
const Nav = defineAsyncComponent(() => import("@c/Nav.vue"));
</script>

<template>
    <div class="flex h-full w-full flex-col">
        <BackGround />

        <Nav />

        <div class="w-full flex-1 overflow-y-auto overflow-x-hidden">
            <router-view v-slot="{ Component }">
                <Fade>
                    <component :is="Component" />
                </Fade>
            </router-view>
        </div>
    </div>
</template>
