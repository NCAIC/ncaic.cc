<script setup lang="ts">
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { useRouter } from "vue-router";
import { Octokit } from "octokit";
import Swal from "sweetalert2";
import { auth, user, github } from "../composables/core";
import { brochure } from "../rules";

const router = useRouter();

const provider = new GithubAuthProvider();
provider.addScope("repo");

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
        github.value = new Octokit({ auth: token });

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
                class="h-4/5 w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap rounded-md border border-gray-800 bg-white/70 p-4"
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
    </div>
</template>
