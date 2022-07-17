<script setup lang="ts">
import { ref, watch, defineAsyncComponent, reactive } from "vue";
import hljs from "highlight.js/es/common";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { team, db, functions, github } from "../../composables/core";
import Swal from "sweetalert2";

const LinkRepo = defineAsyncComponent(() => import("@c/LinkRepo.vue"));

const program = reactive({
    code: "",
    sha: "",
    commit: "",
    time: null as Timestamp | null,
});
const code = ref("");
const updating = ref(false);
const passed = ref(false);
get_code();
watch(team, get_code);

async function get_code() {
    if (db.value === null) {
        return;
    }

    if (!team.value || !team.value.program) {
        return;
    }

    const file = await getDoc(doc(db.value, `code/${team.value.owner}#${team.value.repo}`));

    if (!file.exists()) {
        return;
    }

    Object.assign(program, file.data());

    // @ts-ignore
    code.value = hljs.highlightAuto(program.code).value;

    check_workflow();
}

async function update() {
    if (updating.value) {
        return;
    }
    updating.value = true;
    try {
        if (!functions.value) {
            throw new Error("無法建立遠端連線");
        }

        const token = localStorage.getItem("gho-token");
        if (!token) {
            throw new Error("無法取得 GitHub 授權");
        }

        const params = { token };
        const { data } = await httpsCallable<unknown, { program: typeof program }>(
            functions.value,
            "submit",
        )(params);

        get_code();

        Swal.fire({ title: "更新成功", text: `檔案雜湊：${data.program.sha}`, icon: "success" });
    } catch (err) {
        Swal.fire({ title: "更新失敗", text: (err as Error).message, icon: "error" });
    }
    updating.value = false;
}

async function check_workflow() {
    if (!github.value || !team.value || !program.commit) {
        return;
    }

    const { data } = await github.value.rest.actions.listWorkflowRunsForRepo({
        owner: team.value.owner,
        repo: team.value.repo,
        workflow_id: "check.yml",
        per_page: 5,
    });

    const workflow = data.workflow_runs.find((w) => w.head_sha === program.commit);

    if (workflow?.conclusion === "success") {
        passed.value = true;
    } else {
        passed.value = false;
    }
}
</script>

<template>
    <div>
        <LinkRepo v-if="!team" class="w-full" />
        <div v-else-if="team.program">
            <p>
                程式檔案：{{ team.program }}
                <span
                    :class="{
                        'transition-all': true,
                        'font-mono': true,
                        'text-emerald-500': passed,
                    }"
                    :title="passed ? 'Test Passed' : ''"
                >
                    ({{
                        program.sha
                            ? `${program.sha.slice(0, 7)} @${program.commit.slice(0, 7)}`
                            : "無紀錄"
                    }})
                </span>
            </p>
            <div>
                <button
                    class="my-2 rounded border border-gray-600 p-2 transition-all hover:border-cyan-400 hover:bg-cyan-400 hover:text-white disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500"
                    @click="update"
                    :disabled="updating"
                >
                    更新程式
                </button>
                <span :class="{ ' animate-pulse': updating }">
                    上次更新：{{
                        updating
                            ? "更新中 ..."
                            : program.time
                            ? program.time.toDate().toLocaleString()
                            : "無紀錄"
                    }}
                </span>
            </div>
            <div
                v-if="code"
                class="w-full overflow-auto whitespace-pre-wrap rounded border border-gray-200 p-2"
            >
                <code v-html="code"></code>
            </div>
        </div>
        <div v-else>請於 team.json 中設定 program 位置。</div>
    </div>
</template>
