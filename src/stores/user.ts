import { defineStore } from "pinia";
import type { User } from "@/types/user";

interface State {
	is_auth: boolean
	user: User | null
}

export const useUserStore = defineStore({
	id: "user",
	state: (): State => ({
		user: null,
		is_auth: false,
	}),
	getters: {
		getRights: (state) => state?.user?.rights || {},
		getUser: (state) => state.user,
		getIsAuth: (state) => state.is_auth
	},
	actions: {
		setUser(payload: User | null) {
			this.user = payload
		},
		setIsAuth(payload: boolean) {
			this.is_auth = payload
		},
	},
});