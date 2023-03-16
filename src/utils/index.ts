import axios from "axios";
import * as XLSX from "xlsx";

import type { MongodbPage } from "qqlx-core/utils/database";
import type { ResponseREST } from "qqlx-core/utils/utils";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

declare global {
	interface Window {
		WxLogin: any;
		loginTimer: any;
	}
}

class Request {
	private localAxios;

	constructor() {
		this.localAxios = axios.create({});
		this.localAxios.interceptors.request.use(function (config) {
			config.headers["Content-Type"] = "application/json";
			config.headers["Authorization"] = localStorage.getItem("qqlx-token") || "";
			config.headers["qqlx-corp-id"] = localStorage.getItem("qqlx-corp-id") || "";
			return config;
		});
		this.localAxios.interceptors.response.use(function (response) {
			if ([200, 201].includes(response.status)) {
				if (["40301", "40302"].includes(response.data?.code)) {
					setTimeout(() => {
						localStorage.setItem("qqlx-token", "");
						window.location.assign("/cms-client/login");
					}, 2000);
				}
			}
			return response;
		});
	}

	async get(url: string, body?: any) {
		let result = await this.localAxios.post(url + "/get", body);
		const responseREST = result.data as ResponseREST<any>;
		if (responseREST.code === "200") return responseREST.data;
		else {
			throw new Error(responseREST.message);
		}
	}

	async post(url: string, body?: any) {
		let result = await this.localAxios.post(url, body);
		const responseREST = result.data as ResponseREST<any>;
		if (responseREST.code === "200") return responseREST.data;
		else {
			throw new Error(responseREST.message);
		}
	}

	async patch(url: string, body?: any) {
		let result = await this.localAxios.patch(url, body);
		const responseREST = result.data as ResponseREST<any>;
		if (responseREST.code === "200") return responseREST.data;
		else {
			throw new Error(responseREST.message);
		}
	}

	async put(url: string, body?: any) {
		let result = await this.localAxios.put(url, body);
		const responseREST = result.data as ResponseREST<any>;
		if (responseREST.code === "200") return responseREST.data;
		else {
			throw new Error(responseREST.message);
		}
	}

	async delete(url: string, body?: any) {
		let result = await this.localAxios.post(url + "/delete", body);
		const responseREST = result.data as ResponseREST<any>;
		if (responseREST.code === "200") return responseREST.data;
		else {
			throw new Error(responseREST.message);
		}
	}
}

export const request = new Request();

export function getMongodbBase() {
	return {
		_id: "",
		timeCreate: 0,
		timeCreateString: "",
		timeUpdate: 0,
		timeUpdateString: "",
	};
}
export function getPage(pageSize = 20): MongodbPage {
	const page = {
		page: 1,
		pageSize,
		startTime: 0,
		endTime: Date.now() + 1000 * 60 * 60,
	};
	const date = new Date();
	const year = date.getFullYear();
	page.startTime = new Date(`${year}/01/01 00:00`).getTime();
	return page;
}

// 获取从A-B时间，共有多少天时秒
export function getTimeGap(big: number, small: number) {
	const gap = big - small;

	const hour = ~~(gap / 1000 / 60 / 60) % 24;
	const _hour = hour < 10 ? `0${hour}` : hour.toString();

	const min = ~~(gap / 1000 / 60) % 60;
	const _min = min < 10 ? `0${min}` : min.toString();

	const sec = ~~(gap / 1000) % 60;
	const _sec = sec < 10 ? `0${sec}` : sec.toString();

	const day = ~~(gap / 1000 / 60 / 60 / 24);

	return `${day}天 ${_hour}:${_min}:${_sec}`;
}
