<script setup lang="ts">
import { reactive, ref } from "vue";
import Swal from "sweetalert2";
import { github, team, functions, TeamJson } from "../composables/core";
import { httpsCallable } from "firebase/functions";

const emit = defineEmits(["linked", "error"]);

const repo_list = reactive<any[]>([]);
const selected_repo_idx = ref(-1);
const linking_repo = ref(false);

list_repo();

async function list_repo() {
    try {
        if (github.value === null) {
            throw new Error("GitHub 存取失敗");
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
    } catch (err) {
        Swal.fire({ title: (err as Error).message, icon: "error" });
    }
}

async function link_repo() {
    if (linking_repo.value) {
        return;
    }
    linking_repo.value = true;

    await Swal.fire({
        title: "確定要結繫嗎？",
        text: "結繫後將無法解除",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "結繫",
        cancelButtonText: "取消",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
            try {
                const selected_repo = repo_list[selected_repo_idx.value];

                if (!selected_repo) {
                    throw new Error("無法找到選擇的 GitHub 儲存庫");
                }

                const token = localStorage.getItem("gho-token");
                if (!token) {
                    throw new Error("無法取得 GitHub 授權");
                }

                if (!functions.value) {
                    throw new Error("無法建立遠端連線");
                }

                const params = {
                    owner: selected_repo.owner.login,
                    repo: selected_repo.name,
                    token,
                };
                const { data } = await httpsCallable<unknown, { document: TeamJson }>(
                    functions.value,
                    "register",
                )(params);

                team.value = { ...data.document, owner: params.owner, repo: params.repo };

                Swal.fire({ title: "結繫成功", icon: "success" });

                emit("linked");
            } catch (err) {
                Swal.fire({ title: (err as Error).message, icon: "error" });
                emit("error");
            }
        },
        allowOutsideClick: () => !Swal.isLoading(),
    });

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
