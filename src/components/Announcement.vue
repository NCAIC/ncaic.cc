<script setup lang="ts">
import { computed } from "vue";
import { announcements } from "../composables/core";

const props = defineProps({
    id: { type: String, required: true },
});
const emit = defineEmits(["close"]);

if (!props.id) {
    throw new Error("Announcement id is required");
}

const announcement = computed(() =>
    announcements.find((announcement) => announcement.id === props.id),
);

function close(event: MouseEvent) {
    if (event.target === event.currentTarget) {
        event.stopPropagation();
        emit("close");
    }
}
</script>

<template>
    <div
        class="fixed top-0 left-0 z-50 flex h-full w-full cursor-pointer items-center justify-center bg-black/50"
        @click="close"
    >
        <div class="h-4/5 w-4/5 max-w-5xl cursor-auto overflow-hidden rounded bg-white p-4">
            <div class="h-full w-full overflow-auto rounded">
                <h1 class="text-2xl">{{ announcement?.title }}</h1>
                <hr class="my-2" />
                <p class="mb-4 text-gray-600">{{ announcement?.time.toDate().toLocaleString() }}</p>
                <div class="overflow-auto" v-html="announcement?.content"></div>
            </div>
        </div>
    </div>
</template>
