<script setup lang="ts">
import { ref, watch } from "vue";
import hljs from "highlight.js";
import { Base64 } from "js-base64";
import LinkRepo from "@c/LinkRepo.vue";
import { github, repo, team } from "../../user";

const code = ref("");
get_code();
watch(team, get_code);

async function get_code() {
    if (github.value === null) {
        return;
    }

    if (!team.value.program) {
        return;
    }

    const result = await github.value.rest.repos.getContent({
        ...repo,
        path: team.value.program,
    });

    // @ts-ignore
    code.value = hljs.highlightAuto(Base64.decode(result.data.content)).value;
}
</script>

<template>
    <div>
        <LinkRepo v-if="!repo.repo" class="w-full" />
        <div v-else-if="team.program">
            <p>程式檔案：{{ team.program }}</p>
            <div
                class="w-full overflow-auto whitespace-pre-wrap rounded border border-gray-200 p-2"
            >
                <code v-html="code"></code>
            </div>
        </div>
        <div v-else>請於 team.json 中設定 program 位置。</div>
    </div>
</template>