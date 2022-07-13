<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { collection, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { Base64 } from "js-base64";
import hljs from "highlight.js";
import { auth, user, github, initialized, db } from "../user";
import { brochure } from "../rules";
import Fade from "@c/Fade.vue";

const router = useRouter();

signed_guard();
watch(user, signed_guard);
watch(initialized, signed_guard);

const tab = ref("general");
const repo = reactive({ owner: "", repo: "" });
const repo_list = reactive<any[]>([]);
const selected_repo_idx = ref(-1);
let listing_repo = false;
let linking_repo = ref(false);
const team_info = ref<{
    name: string;
    org: string;
    members: { name: string; email: string; github: string }[];
    program: string;
}>({ name: "", org: "", members: [], program: "" });
const github_me = ref<any>(null);
const program_code = ref("");

watch(repo, async () => {
    if (repo.owner && repo.repo) {
        await get_team_info();
        await get_code();
    }
});

async function signed_guard() {
    if (user.value === null && initialized.value) {
        router.push("/");
    } else if (user.value !== null && initialized.value) {
        await getDoc(doc(collection(db, "repo"), user.value.uid)).then((doc) => {
            if (doc.exists()) {
                [repo.owner, repo.repo] = [doc.data().owner, doc.data().repo];
            }
        });

        if (repo_list.length === 0 && !repo.owner && !repo.repo) {
            await list_repo().then((list) => {
                if (repo_list.length === 0 && list) {
                    repo_list.push(...list);
                }
            });
        }

        if (github.value) {
            github_me.value = (await github.value.rest.users.getAuthenticated()).data;
        }
    }
}

async function list_repo() {
    if (listing_repo) {
        return;
    }
    listing_repo = true;
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

    listing_repo = false;
    console.log(repos);
    return repos;
}

async function get_team_info() {
    if (github.value === null) {
        return;
    }

    const result = await github.value.rest.repos.getContent({ ...repo, path: "team.json" });

    if (result.status !== 200) {
        return;
    }

    // @ts-ignore
    const data = JSON.parse(Base64.decode(result.data.content));

    team_info.value = data;
}

async function get_code() {
    if (github.value === null) {
        return;
    }

    if (!team_info.value.program) {
        return;
    }

    const result = await github.value.rest.repos.getContent({
        ...repo,
        path: team_info.value.program,
    });

    if (result.status !== 200) {
        return;
    }

    // @ts-ignore
    program_code.value = hljs.highlightAuto(Base64.decode(result.data.content)).value;
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

        await getDoc(doc(collection(db, "repo"), user.value.uid)).then((doc) => {
            if (doc.exists()) {
                [repo.owner, repo.repo] = [doc.data().owner, doc.data().repo];
            }
        });
    } catch (e) {
        console.error(e);
    }

    linking_repo.value = false;
}

async function unlink_repo() {
    if (linking_repo.value) {
        return;
    }
    linking_repo.value = true;

    try {
        if (user.value === null) {
            throw new Error("user is null");
        }

        await deleteDoc(doc(collection(db, "repo"), user.value.uid));

        await getDoc(doc(collection(db, "repo"), user.value.uid)).then(async (doc) => {
            if (!doc.exists()) {
                [repo.owner, repo.repo] = ["", ""];

                if (repo_list.length === 0 && !repo.owner && !repo.repo) {
                    await list_repo().then((list) => {
                        if (repo_list.length === 0 && list) {
                            repo_list.push(...list);
                        }
                    });
                }
            }
        });
    } catch (e) {
        console.error(e);
    }

    linking_repo.value = false;
}
</script>

<template>
    <div v-show="user" class="flex h-full w-full justify-center p-4">
        <div class="flex w-4/5 max-w-3xl flex-col items-center">
            <h1 class="my-4 text-3xl">資訊面板 Dashboard</h1>
            <div class="flex w-full flex-col md:flex-row">
                <div class="flex flex-col border-b border-gray-400 px-2 md:border-b-0 md:border-r">
                    <button
                        :class="[
                            'mb-1 block rounded-lg border  p-2 text-left transition-all hover:bg-gray-500/20 md:w-40',
                            tab === 'general' ? 'border-gray-400' : 'border-transparent',
                        ]"
                        @click="tab = 'general'"
                    >
                        一般 General
                    </button>
                    <button
                        :class="[
                            'mb-1 block rounded-lg border  p-2 text-left transition-all hover:bg-gray-500/20 md:w-40',
                            tab === 'team' ? 'border-gray-400' : 'border-transparent',
                        ]"
                        @click="tab = 'team'"
                    >
                        隊伍 Team
                    </button>
                    <button
                        :class="[
                            'mb-1 block rounded-lg border p-2 text-left transition-all hover:bg-gray-500/20 md:w-40',
                            tab === 'code' ? 'border-gray-400' : 'border-transparent',
                        ]"
                        @click="tab = 'code'"
                    >
                        程式 Code
                    </button>
                    <button
                        :class="[
                            'mb-1 block rounded-lg border p-2 text-left transition-all hover:bg-gray-500/20 md:w-40',
                            tab === 'rule' ? 'border-gray-400' : 'border-transparent',
                        ]"
                        @click="tab = 'rule'"
                    >
                        規則 Rule
                    </button>
                </div>
                <div class="flex-1 overflow-auto p-2">
                    <Fade>
                        <div v-if="tab === 'general'">
                            <p class="text-lg">
                                {{ user?.providerData[0].displayName || "無名氏" }} ({{
                                    user?.providerData[0].email || "無電子郵件"
                                }})
                            </p>

                            <button
                                class="my-2 rounded border border-gray-600 p-2 transition-all hover:border-rose-600 hover:bg-rose-500 hover:text-white"
                                @click="auth.signOut()"
                            >
                                登出 Sign Out
                            </button>
                        </div>
                        <div v-if="tab === 'team'" class="w-full">
                            <div v-if="!repo.repo" class="w-full">
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
                                        @click="link_repo()"
                                        :disabled="selected_repo_idx === -1 || linking_repo"
                                    >
                                        結繫此 GitHub 儲存庫
                                    </button>
                                </div>
                                <div v-else>載入中...</div>
                            </div>
                            <div v-else>
                                隊伍已建立，結繫至
                                <a
                                    class="text-blue-600"
                                    :href="`https://github.com/${repo.owner}/${repo.repo}/`"
                                    target="_blank"
                                    >{{ repo.owner }}/{{ repo.repo }}</a
                                >

                                <hr />

                                <h2 class="text-xl">
                                    隊伍名稱 | {{ team_info.name || "無法正確解析" }}
                                </h2>
                                <h2 class="text-xl">
                                    所屬組織 | {{ team_info.org || "無法正確解析" }}
                                </h2>

                                <div class="my-4">
                                    <h2 class="text-xl">隊伍成員</h2>
                                    <div
                                        class="text-rose-600"
                                        v-if="
                                            team_info.members.every(
                                                (mem) =>
                                                    mem.github.toLowerCase() !==
                                                    github_me.login.toLowerCase(),
                                            )
                                        "
                                    >
                                        注意：隊伍成員沒有你，請記得修改 team.json 來添加成員。
                                    </div>
                                    <div
                                        class="m-2"
                                        v-for="(member, idx) in team_info.members"
                                        :key="idx"
                                    >
                                        {{ idx + 1 }}.
                                        <a
                                            :class="{
                                                'text-blue-600': member.github,
                                                'text-orange-500':
                                                    member.github.toLowerCase() ===
                                                    github_me.login.toLowerCase(),
                                            }"
                                            :href="
                                                member.github
                                                    ? 'https://github.com/' + member.github
                                                    : ''
                                            "
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
                                </div>
                            </div>
                        </div>
                        <div v-if="tab === 'code'" class="w-full">
                            <div v-if="!repo.repo" class="w-full">
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
                                        @click="link_repo()"
                                        :disabled="selected_repo_idx === -1 || linking_repo"
                                    >
                                        結繫此 GitHub 儲存庫
                                    </button>
                                </div>
                                <div v-else>載入中...</div>
                            </div>
                            <div v-else-if="team_info.program">
                                <p>程式檔案：{{ team_info.program }}</p>
                                <div
                                    class="w-full overflow-auto whitespace-pre-wrap rounded border border-gray-200 p-2"
                                >
                                    <code v-html="program_code"></code>
                                </div>
                            </div>
                            <div v-else>請於 team.json 中設定 program 位置。</div>
                        </div>
                        <div v-if="tab === 'rule'">
                            <h1 class="text-xl">競賽規則</h1>
                            <p class="whitespace-pre-wrap" v-html="brochure"></p>
                        </div>
                    </Fade>
                </div>
            </div>
        </div>
        <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.5.1/build/styles/default.min.css"
        />
    </div>
</template>
