<script setup lang="ts">
import { user, sign_out } from "../../composables/core";
</script>

<template>
    <div>
        <p class="text-lg">
            {{ user?.providerData[0].displayName || "無名氏" }} ({{
                user?.providerData[0].email || "無電子郵件"
            }})
        </p>

        <button
            class="my-2 rounded border border-gray-600 p-2 transition-all hover:border-rose-600 hover:bg-rose-500 hover:text-white"
            @click="sign_out"
        >
            登出 Sign Out
        </button>
    </div>
</template>
