<script setup lang="ts">
import BackGround from "@c/BackGround.vue";
import Nav from "@c/Nav.vue";
import Fade from "@c/Fade.vue";
</script>

<template>
    <div class="flex h-full w-full flex-col">
        <BackGround></BackGround>

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
