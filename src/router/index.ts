// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{
		path: "/oa-client",
		redirect: "/oa-client/home/index",
		component: () => import("@/components/layout.vue"),
		children: [
			{
				path: "home",
				name: "主页",
				component: () => import("@/views/system/index.vue"),
				children: [
					{
						path: "index",
						name: "主页",
						component: () => import("@/views/system/home.vue"),
						meta: { icon: "insights", color: "primary", backColorClass: "color-back-system", show: true },
					},
				],
			},
		],
	},
	{
		path: "/oa-client/login",
		component: () => import("@/views/login/index.vue"),
	},
	{
		path: "/:catchAll(.*)",
		component: () => import("@/views/error/404.vue"),
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
