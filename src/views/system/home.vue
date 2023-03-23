<template>
    <div class="q-px-lg q-pb-xl bg-dark">
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
                    <div class="col">手机号</div>
                    <div class="col text-right">{{ UserStore.userEditor?.phone || "-" }}</div>
                </div>
            </q-card-section>
            <q-card-actions>
                <q-space></q-space>
                <q-btn class="full-width" push color="cyan" @click="goProfile">去修改</q-btn>
            </q-card-actions>
        </q-card>
    </div>
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

// vue

const goProfile = () => {
    const info = UserStore.userEditor;
    // @ts-ignore
    wx.miniProgram.navigateTo({
        url: `/pages/autho/index?avator=${info.avator}&nickname=${info.nickname}&phone=${info.phone}`,
        fail: (res: any) => alert(JSON.stringify(res)),
    });
};
onMounted(async () => {
    try {
        userIdUrl.value = await QrCode.toDataURL(UserStore.userEditor?.userId);
    } catch (error) {
        NotifyStore.fail((error as Error).message);
    }
});
</script>

<style scoped lang="scss"></style>
