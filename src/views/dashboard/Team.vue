<script setup lang="ts">
import LinkRepo from "@c/LinkRepo.vue";
import { deleteDoc, doc, collection, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { user, repo, team, github_me, db } from "../../user";

async function unlink_repo() {
    try {
        if (team.value.register) {
            throw new Error("已完成報名，不得取消結繫");
        }
        if (user.value === null) {
            throw new Error("使用者未登入");
        }

        await deleteDoc(doc(collection(db, "repo"), user.value.uid));

        await getDoc(doc(collection(db, "repo"), user.value.uid)).then(async (doc) => {
            if (!doc.exists()) {
                [repo.owner, repo.repo] = ["", ""];
            }
        });
    } catch (err) {
        Swal.fire({ title: (err as Error).message, icon: "error" });
    }
}
</script>

<template>
    <div>
        <LinkRepo v-if="!repo.repo" class="w-full" />
        <div v-else>
            隊伍已建立，結繫至
            <a
                class="text-blue-600"
                :href="`https://github.com/${repo.owner}/${repo.repo}/`"
                target="_blank"
                >{{ repo.owner }}/{{ repo.repo }}</a
            >

            <hr />

            <h2 v-if="team.register" class="text-xl text-emerald-500">已完成報名</h2>
            <h2 v-else class="text-xl text-rose-500">
                尚未完成報名，將 register 欄位設為 true 來報名競賽
            </h2>
            <h2 class="text-xl">隊伍名稱 | {{ team.name || "無法正確解析" }}</h2>
            <h2 class="text-xl">所屬組織 | {{ team.org || "無法正確解析" }}</h2>

            <div class="my-4">
                <h2 class="text-xl">隊伍成員</h2>
                <div
                    class="text-rose-600"
                    v-if="
                        team.members.every(
                            (mem) => mem.github.toLowerCase() !== github_me.login.toLowerCase(),
                        )
                    "
                >
                    注意：隊伍成員沒有你，請記得修改 team.json 來添加成員。
                </div>
                <div class="m-2" v-for="(member, idx) in team.members" :key="idx">
                    {{ idx + 1 }}.
                    <a
                        :class="{
                            'text-blue-600': member.github,
                            'text-orange-500':
                                member.github.toLowerCase() === github_me.login.toLowerCase(),
                        }"
                        :href="member.github ? 'https://github.com/' + member.github : ''"
                        target="_blank"
                    >
                        <span>{{ idx === 0 ? "[Leader]" : "" }}</span>
                        {{ member.name }} ({{ member.email }})</a
                    >
                </div>
            </div>

            <div>
                <button
                    class="my-2 rounded border border-gray-600 p-2 transition-all hover:border-rose-600 hover:bg-rose-500 hover:text-white"
                    @click="unlink_repo"
                >
                    取消結繫
                </button>
                <a
                    class="my-2 ml-2 rounded border border-gray-600 p-2 py-3 transition-all hover:border-blue-600 hover:bg-blue-500 hover:text-white"
                    :href="`https://github.com/${repo.owner}/${repo.repo}/blob/main/team.json`"
                    target="_blank"
                >
                    team.json
                </a>
            </div>
        </div>
    </div>
</template>
