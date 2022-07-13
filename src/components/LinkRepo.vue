<script setup lang="ts">
import { setDoc, doc, collection } from "firebase/firestore";
import { reactive, ref } from "vue";
import { db, github, user, repo } from "../user";

const emit = defineEmits(["linked", "error"]);

const repo_list = reactive<any[]>([]);
const selected_repo_idx = ref(-1);
const linking_repo = ref(false);

list_repo();

async function list_repo() {
    if (github.value === null) {
        throw new Error("github is null");
    }

    console.time("list repo");
    const repos = [];
    let i = 0;
    while (true) {
        const result = (
            await github.value.rest.repos.listForAuthenticatedUser({
                sort: "updated",
                page: i++,
                per_page: 100,
            })
        ).data;
        repos.push(...result);
        if (result.length < 100) {
            break;
        }
    }
    console.timeEnd("list repo");

    console.log(repos);
    repo_list.push(...repos);
}

async function link_repo() {
    if (linking_repo.value) {
        return;
    }
    linking_repo.value = true;

    try {
        const selected_repo = repo_list[selected_repo_idx.value];

        if (!selected_repo) {
            throw new Error("repo is null");
        }

        const data = { owner: selected_repo.owner.login, repo: selected_repo.name };

        if (user.value === null) {
            throw new Error("user is null");
        }

        await setDoc(doc(collection(db, "repo"), user.value.uid), data);

        repo.owner = data.owner;
        repo.repo = data.repo;

        emit("linked");
    } catch (err) {
        console.error(err);
        emit("error");
    }

    linking_repo.value = false;
}
</script>

<template>
    <div>
        你目前尚未建立隊伍。要建立隊伍，請先選擇結繫的 GitHub 儲存庫。

        <div v-if="repo_list.length" class="w-full">
            <select
                class="my-2 max-w-full rounded border border-gray-600 p-2 transition-all hover:border-gray-800"
                v-model="selected_repo_idx"
            >
                <option v-for="(repo, index) in repo_list" :value="index">
                    {{ repo.owner.login }}/{{ repo.name }}
                </option>
            </select>

            <button
                class="my-2 rounded border border-gray-600 p-2 transition-all hover:border-emerald-400 hover:bg-emerald-400 hover:text-white disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500"
                @click="link_repo"
                :disabled="selected_repo_idx === -1 || linking_repo"
            >
                結繫此 GitHub 儲存庫
            </button>
        </div>
        <div v-else class="animate-pulse">正在載入 GitHub 儲存庫...</div>
    </div>
</template>
