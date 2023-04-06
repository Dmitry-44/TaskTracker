import { defineStore } from "pinia";
import type { User, UserSimple } from "@/types/user";

interface State {
	is_auth: boolean
	user: User | null
	allUsers: UserSimple[]
}

export const useUserStore = defineStore({
	id: "user",
	state: (): State => ({
		user: null,
		is_auth: false,
		allUsers: []
	}),
	getters: {
		getRights: (state) => state?.user?.rights || {},
		getUser: (state) => state.user,
		getIsAuth: (state) => state.is_auth,
		getAllUsers: (state) => state.allUsers
	},
	actions: {
		setUser(payload: User | null) {
			this.user = payload
		},
		setIsAuth(payload: boolean) {
			this.is_auth = payload
		},
		setUsers(payload: UserSimple[]) {
			this.allUsers=payload
		}
	},
});