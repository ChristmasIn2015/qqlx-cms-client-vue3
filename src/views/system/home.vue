<template>
	<div class="q-px-lg">
		<div class="text-center text-white text-weight-bold text-h5 q-mb-md">身份令牌</div>
		<q-card class="q-mb-md">
			<q-img :src="userIdUrl"></q-img>
		</q-card>
		<q-card>
			<q-card-section class="text-h6 row">
				<div>基本信息</div>
				<q-space></q-space>
				<q-avatar>
					<q-img :src="UserStore.userEditor?.avator || UserStore.wxAvatorDefault"></q-img>
				</q-avatar>
			</q-card-section>
			<q-card-section>
				<div class="row q-pb-sm">
					<div class="col">姓名/昵称</div>
					<div class="col text-right">{{ UserStore.userEditor?.nickname }}</div>
				</div>
				<div class="row">
					<div class="col">创建日期</div>
					<div class="col text-right">{{ UserStore.userEditor?.timeCreateString }}</div>
				</div>
			</q-card-section>
			<q-card-actions>
				<q-space></q-space>
				<q-btn push square @click="userDialog = true" color="cyan">修改</q-btn>
			</q-card-actions>
		</q-card>
	</div>

	<q-dialog v-model="userDialog">
		<q-card class="w-400">
			<q-toolbar>
				<q-toolbar-title>基本信息</q-toolbar-title>

				<q-btn flat dense icon="close" v-close-popup />
			</q-toolbar>

			<q-separator />

			<q-card-section>
				<q-input color="cyan" filled label="姓名/昵称" class="q-mb-sm" v-model="UserStore.userEditor.nickname">
					<template v-slot:before>
						<q-icon name="person" />
					</template>
				</q-input>
			</q-card-section>

			<q-card-actions>
				<q-space></q-space>
				<q-btn color="cyan" square push v-close-popup @click="UserStore.patch()"> 保存 </q-btn>
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script lang="ts" setup>
import QrCode from "qrcode";
import { onMounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

import { getTimeGap } from "@/utils";
import { useNotifyStore } from "@/stores/notify";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const router = useRouter();
const routes = router.options.routes[0].children;

const NotifyStore = useNotifyStore();
const UserStore = useUserStore();

const userIdUrl = ref("");
const userDialog = ref(false);

// vue
onMounted(async () => {
	try {
		await UserStore.setNowUser();
		userIdUrl.value = await QrCode.toDataURL(UserStore.userEditor?.userId);
	} catch (error) {
		NotifyStore.fail((error as Error).message);
	}
});
</script>

<style scoped lang="scss"></style>
