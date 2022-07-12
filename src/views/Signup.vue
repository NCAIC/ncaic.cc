<script setup lang="ts">
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { provide } from "vue";
import { useRouter } from "vue-router";
import { auth, user } from "../firebase";
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
        const result = await signInWithPopup(auth, provider);

        const credential = GithubAuthProvider.credentialFromResult(result);
        if (!credential) {
            throw new Error("credential is null");
        }

        const token = credential.accessToken;
        const user = result.user;
        console.log(token, user);

        if (!token || !user) {
            throw new Error("token or user is null");
        }

        router.push("/dashboard");
    } catch (error) {
        console.error(error);
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
