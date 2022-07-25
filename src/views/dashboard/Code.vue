<script setup lang="ts">
import { ref, watch, defineAsyncComponent, reactive } from "vue";
import Swal from "sweetalert2";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import hljs from "highlight.js/es/common";
import Fade from "../../components/Fade.vue";
import { team, db, functions, github } from "../../composables/core";
import { open } from "../../composables/open";

const LinkRepo = defineAsyncComponent(() => import("@c/LinkRepo.vue"));
const MdiCheck = defineAsyncComponent(() => import("~icons/mdi/Check.vue"));
const MdiTimerAlert = defineAsyncComponent(() => import("~icons/mdi/TimerAlert.vue"));
const MdiCloseThick = defineAsyncComponent(() => import("~icons/mdi/CloseThick.vue"));
const MdiMotionPlay = defineAsyncComponent(() => import("~icons/mdi/MotionPlay.vue"));
const MdiAlertBox = defineAsyncComponent(() => import("~icons/mdi/AlertBox.vue"));

const program = reactive({
    code: "",
    sha: "",
    commit: "",
    time: null as Timestamp | null,
});
const code = ref("");
const updating = ref(false);
const test_status = ref(-1);
const workflow_url = ref("");
get_code().then(() => check_workflow());

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

        get_code().then(() => check_workflow());

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

    test_status.value = -1;

    const { data } = await github.value.rest.actions.listWorkflowRunsForRepo({
        owner: team.value.owner,
        repo: team.value.repo,
        workflow_id: "check.yml",
        per_page: 5,
    });

    const workflow = data.workflow_runs.find((w) => w.head_sha === program.commit);

    if (!workflow) {
        test_status.value = 0;
        setTimeout(() => check_workflow(), 30_000);
        return;
    }

    console.log(workflow);

    if (["in_progress", "queued", "requested", "waiting"].includes(workflow.status || "")) {
        test_status.value = 3;
        setTimeout(() => check_workflow(), 30_000);
        return;
    }

    if (workflow.status !== "completed") {
        test_status.value = 4;
        return;
    }

    if (workflow.conclusion === "success") {
        test_status.value = 1;
    } else {
        test_status.value = 2;
    }

    workflow_url.value = workflow.html_url;
}
</script>

<template>
    <div>
        <LinkRepo v-if="!team" class="w-full" />
        <div v-else-if="team.program">
            <div>
                <p>
                    程式檔案：{{ team.program }}
                    <a
                        :class="['transition-all', 'font-mono', 'text-blue-500']"
                        :href="`https://github.com/${team.owner}/${team.repo}/blob/${program.commit}/${team.program}`"
                        target="_blank"
                    >
                        ({{
                            program.sha
                                ? `${program.sha.slice(0, 7)} @${program.commit.slice(0, 7)}`
                                : "無紀錄"
                        }})
                    </a>
                </p>
            </div>
            <Fade>
                <div v-if="test_status >= 0" class="text-lg">
                    <div v-if="test_status === 0" class="flex flex-row items-center text-slate-500">
                        <MdiTimerAlert class="mr-1 inline-block" />
                        無自動測試記錄，重新提交或稍等一下
                    </div>
                    <div
                        v-if="test_status === 1"
                        class="flex cursor-pointer flex-row items-center text-emerald-500"
                        @click="open(workflow_url)"
                    >
                        <MdiCheck class="mr-1 inline-block" />
                        此 Commit 已通過自動測試
                    </div>
                    <div
                        v-if="test_status === 2"
                        class="flex cursor-pointer flex-row items-center text-rose-500"
                        @click="open(workflow_url)"
                    >
                        <MdiCloseThick class="mr-1 inline-block" />
                        此 Commit 未通過自動測試
                    </div>
                    <div
                        v-if="test_status === 3"
                        class="flex animate-pulse cursor-pointer flex-row items-center text-amber-500"
                        @click="open(workflow_url)"
                    >
                        <MdiMotionPlay class="mr-1 inline-block" />
                        自動測試正在進行中
                    </div>
                    <div
                        v-if="test_status === 4"
                        class="flex cursor-pointer flex-row items-center text-slate-500"
                        @click="open(workflow_url)"
                    >
                        <MdiAlertBox class="mr-1 inline-block" />
                        自動測試狀態未知
                    </div>
                </div>
                <div v-else-if="team.program" class="animate-pulse text-lg text-slate-500">
                    正在檢查自動測試記錄
                </div>
            </Fade>
            <div>
                <button
                    class="my-2 rounded border border-slate-600 p-2 transition-all hover:border-cyan-400 hover:bg-cyan-400 hover:text-white disabled:border-slate-300 disabled:bg-slate-300 disabled:text-slate-500"
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
                class="w-full overflow-auto whitespace-pre-wrap rounded border border-slate-200 p-2"
            >
                <code v-html="code"></code>
            </div>
        </div>
        <div v-else>請於 team.json 中設定 program 位置。</div>
    </div>
</template>
