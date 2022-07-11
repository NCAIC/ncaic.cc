<script setup lang="ts">
const links = {
    Agenda: "/agenda",
    Stream: "/stream",
    Signup: "/signup",
};
</script>

<template>
    <div class="flex h-16 w-full items-center border-b-2 border-gray-600">
        <router-link to="/" class="flex h-full items-center p-2 text-3xl font-bold tracking-wider">
            <span>NCAIC</span>
        </router-link>
        <div class="flex h-full flex-1 flex-row justify-end">
            <router-link
                v-for="(link, key) in links"
                :to="link"
                class="flex h-full items-center p-2 text-xl tracking-wide transition-all duration-300 hover:bg-black hover:text-white md:px-3 lg:px-4"
            >
                {{ key }}
            </router-link>
        </div>
    </div>
</template>
