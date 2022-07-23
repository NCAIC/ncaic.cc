<script setup lang="ts">
import { ref } from "vue";
import { render } from "../../composables/markdown";

const brochure = ref("載入中...");
render("docs/brochure.md").then((html) => {
    if (html) {
        brochure.value = html;
    }
});
</script>

<template>
    <div>
        <h1 class="text-xl">競賽規則</h1>
        <p class="markdown-body whitespace-pre-wrap" v-html="brochure"></p>
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown-light.min.css"
            crossorigin="anonymous"
            referrerpolicy="no-referrer"
        />
    </div>
</template>
