import { emptyUser, type Division } from './../types/user';
import { defineStore } from "pinia";
import type { User, UserSimple } from "@/types/user";

interface State {
	is_auth: boolean
	user: User
	allUsers: UserSimple[]
	divisions: Division[]
}

export const useUserStore = defineStore({
	id: "user",
	state: (): State => ({
		user: emptyUser,
		is_auth: false,
		allUsers: [],
		divisions: [],
	}),
	getters: {
		getRights: (state) => state?.user?.rights || {},
		getUser: (state) => state.user,
		getIsAuth: (state) => state.is_auth,
		getAllUsers: (state) => state.allUsers,
		getDivisions: (state) => state.divisions
	},
	actions: {
		setUser(payload: User) {
			this.user = payload
		},
		setIsAuth(payload: boolean) {
			this.is_auth = payload
		},
		setUsers(payload: UserSimple[]) {
			this.allUsers=payload
		},
		setDivisions(payload: Division[]){
			this.divisions=payload
		}
	},
});