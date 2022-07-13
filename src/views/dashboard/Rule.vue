<script setup lang="ts">
import { brochure } from "../../rules";
</script>

<template>
    <div>
        <h1 class="text-xl">競賽規則</h1>
        <p class="whitespace-pre-wrap" v-html="brochure"></p>
    </div>
</template>
