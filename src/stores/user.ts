import { emptyUser, type Division } from './../types/user';
import { defineStore } from "pinia";
import type { User, Person } from "@/types/user";

interface State {
	is_auth: boolean
	user: User
	allUsers: Person[]
	divisionsList: Division[]
	persons: Person[]
	divisionsData: Record<UniqueId, DivisionData>
}

export type DivisionData = Division & {
	persons: Person[]
}

export const useUserStore = defineStore({
	id: "user",
	state: (): State => ({
		user: emptyUser,
		is_auth: false,
		allUsers: [],
		divisionsList: [],
		persons: [],
		divisionsData: {}
	}),
	getters: {
		getRights: (state) => state?.user?.rights || {},
		getUser: (state) => state.user,
		getIsAuth: (state) => state.is_auth,
		getAllUsers: (state) => state.allUsers,
		getDivisions: (state) => state.divisionsList,
		getDivisionsData: (state) => state.divisionsData,
	},
	actions: {
		setUser(payload: User) {
			this.user = payload
		},
		setIsAuth(payload: boolean) {
			this.is_auth = payload
		},
		setUsers(payload: Person[]) {
			this.allUsers=payload
		},
		setDivisions(payload: Division[]){
			this.divisionsList=payload
		},
		setPersons(payload: Person[]):void {
			this.persons=payload
		},
		setDivisionData(divisionId: Division['id'], persons: Person[]): void {
			const division = this.divisionsList.find(div=>div.id===divisionId)
			if(!division)return;
			this.divisionsData[divisionId]=Object.assign(division, { persons: persons })
		}
	},
});