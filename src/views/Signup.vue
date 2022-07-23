<script setup lang="ts">
import { ref } from "vue";
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { useRouter } from "vue-router";
import { Octokit } from "octokit";
import Swal from "sweetalert2";
import { auth, user, github, gh_self } from "../composables/core";
import { render } from "../composables/markdown";

const router = useRouter();

const provider = new GithubAuthProvider();
provider.addScope("repo");

const brochure = ref("載入中...");

render("docs/brochure.md").then((html) => {
    if (html) {
        brochure.value = html;
    }
});

async function sign() {
    if (user.value) {
        router.push("/dashboard");
        return;
    }
    try {
        if (!auth.value) {
            throw new Error("Firebase 存取失敗");
        }

        const result = await signInWithPopup(auth.value, provider);

        const credential = GithubAuthProvider.credentialFromResult(result);
        if (!credential || !credential.accessToken) {
            throw new Error("GitHub 驗證失敗");
        }

        const token = credential.accessToken;
        const user = result.user;

        if (!token || !user) {
            throw new Error("遺失登入資訊");
        }

        localStorage.setItem("gho-token", token);
        localStorage.setItem("gho-expires", (Date.now() + 2 * 60 * 60 * 1000).toString());
        github.value = new Octokit({ auth: token });
        gh_self.value = (await github.value.rest.users.getAuthenticated()).data;

        router.push("/dashboard");
    } catch (err) {
        Swal.fire({ title: (err as Error).message, icon: "error" });
    }
}
</script>

<template>
    <div class="flex h-full w-full justify-center p-4">
        <div class="flex h-full w-4/5 max-w-3xl flex-col items-center">
            <h1 class="my-4 text-3xl">競賽報名 Signup</h1>

            <div
                class="markdown-body h-4/5 w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap rounded-md border border-gray-800 bg-white/70 p-4"
                v-html="brochure"
            ></div>

            <div class="m-4">
                <button
                    class="trnasition-all rounded-md border-2 border-black bg-transparent p-4 duration-200 ease-in-out hover:bg-black hover:text-white"
                    @click="sign"
                >
                    {{ user ? "前往資訊面板" : "使用 GitHub 驗證" }}
                </button>
            </div>
        </div>
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown-light.min.css"
            integrity="sha512-zb2pp+R+czM7GAemdSUQt6jFmr3qCo6ikvBgVU6F5GvwEDR0C2sefFiPEJ9QUpmAKdD5EqDUdNRtbOYnbF/eyQ=="
            crossorigin="anonymous"
            referrerpolicy="no-referrer"
        />
    </div>
</template>
