<script setup lang="ts">
import LinkRepo from "@c/LinkRepo.vue";
import { team, gh_self } from "../../composables/core";
</script>

<template>
    <div>
        <LinkRepo v-if="!team" class="w-full" />
        <div v-else>
            隊伍已建立，結繫至
            <a
                class="text-blue-600"
                :href="`https://github.com/${team.owner}/${team.repo}/`"
                target="_blank"
                >{{ team.owner }}/{{ team.repo }}</a
            >

            <hr />

            <h2 v-if="team.register" class="text-xl text-emerald-500">已完成報名</h2>
            <h2 class="text-xl">隊伍名稱 | {{ team.name || "無法正確解析" }}</h2>
            <h2 class="text-xl">所屬組織 | {{ team.org || "無法正確解析" }}</h2>

            <div class="my-4">
                <h2 class="text-xl">隊伍成員</h2>
                <div class="m-2" v-for="(member, idx) in team.members" :key="idx">
                    {{ idx + 1 }}.
                    <a
                        :class="{
                            'text-blue-600': member.github,
                            'text-orange-500':
                                member.github.toLowerCase() === gh_self.login.toLowerCase(),
                        }"
                        :href="member.github ? 'https://github.com/' + member.github : ''"
                        target="_blank"
                    >
                        <span>{{ idx === 0 ? "[Leader]" : "" }}</span>
                        {{ member.name }} ({{ member.email }})</a
                    >
                </div>
            </div>
        </div>
    </div>
</template>
