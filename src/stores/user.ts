import { defineStore } from "pinia";

import { PATH_USER } from "qqlx-core";
import type { postUserWeChatDto, postUserWeChatRes, getUserWeChatDto, getUserWeChatRes, patchUserWeChatDto, patchUserWeChatRes } from "qqlx-core/dto/user/user";
import type { UserInfo } from "qqlx-core/dto/user/user";

import { getMongodbBase, request } from "@/utils";
import { useNotifyStore } from "@/stores/notify";
const NotifyStore = useNotifyStore();

function getSchema(): UserInfo {
    return {
        userId: "",
        phone: "",
        nickname: "",
        avator: "",
    };
}
export const useUserStore = defineStore({
    id: "User",
    state: () => ({
        userIdQrCode: "",

        wxAvatorDefault: "https://pic4.zhimg.com/50/v2-6afa72220d29f045c15217aa6b275808_hd.jpg?source=1940ef5c",
        userEditor: getSchema() as UserInfo,
    }),
    actions: {
        async post(wechatResponseCode: string) {
            const dto: postUserWeChatDto = { wechatResponseCode, isWxmp: true };
            const res: postUserWeChatRes = await request.post(PATH_USER, { dto });

            if (res.jwt) localStorage.setItem("qqlx-token", res.jwt);
            else localStorage.setItem("qqlx-token", "");
        },
        // 获取用户信息
        async setUser() {
            this.setSchema();
            const dto: getUserWeChatDto = null;
            const res: getUserWeChatRes = await request.get(PATH_USER, { dto });
            this.userEditor = res;
        },
        async patch(clientPhoneCode?: string) {
            try {
                const dto: patchUserWeChatDto = { ...this.userEditor, clientPhoneCode };
                await request.patch(PATH_USER, { dto });
                await this.setUser();
                NotifyStore.success("修改成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        getSchema() {
            const schema: UserInfo = getSchema();
            return schema;
        },
        setSchema() {
            this.userEditor = this.getSchema();
        },
    },
});
