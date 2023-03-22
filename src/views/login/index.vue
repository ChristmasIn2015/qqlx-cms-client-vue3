<template>
    <div class="column full-height q-px-xl items-center q-py-xl">
        <q-img class="select-none q-mt-xl full-width" src="@/assets/index.png" fit="cover"></q-img>
        <q-btn size="lg" class="full-width q-my-xl" push color="cyan" :loading="loading" @click="reLunch">{{ loading ? "" : "点击重试" }}</q-btn>
        <div class="text-white text-weight-bold text-body1">{{ message }}</div>
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

const loading = ref(true);
const message = ref("正在为您登陆《OA平台》");

// @ts-ignore
const reLunch = () => wx.miniProgram.reLaunch({ url: "/pages/index/index" });
onMounted(async () => {
    try {
        const code = route.query.code as string;

        if (code) {
            await UserStore.post(code);
            await UserStore.setUser();

            const avator = route.query.avator as string;
            avator && (UserStore.userEditor.avator = avator);
            const nickname = route.query.nickname as string;
            nickname && (UserStore.userEditor.nickname = nickname);

            const clientPhoneCode = route.query.clientPhoneCode as string;
            await UserStore.patch(clientPhoneCode);
            router.push("/oa-client");
        }
    } catch (error) {
        loading.value = false;
        message.value = (error as Error).message;
    }
});
</script>

<style scoped lang="scss"></style>
