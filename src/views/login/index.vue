<template>
	<div class="column bg-dark full-height q-px-md items-center q-py-xl">
		<q-img class="select-none q-mt-xl full-width" style="transform: translateX(20px)" src="@/assets/index.png" fit="cover"></q-img>
		<q-btn size="lg" disabled class="q-mb-xl" push color="cyan">请重新打开小程序</q-btn>
		<q-space></q-space>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const router = useRouter();

const UserStore = useUserStore();

onMounted(async () => {
	const { code } = route.query;
	if (code) {
		const info = await UserStore.post(code as string);
		UserStore.userEditor = info;
		router.push("/oa-client");
	}
});
</script>

<style scoped lang="scss"></style>
