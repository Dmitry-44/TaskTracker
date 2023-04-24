import type { AxiosResponse } from "axios";
import type { ApiResponse, UserResponse } from "@/api";

type User = {
	id: UniqueId;
	fio: string;
	groups: UniqueId[];
	rights: Record<string, any>;
	selected_group: UniqueId;
}

type Person = {
	id: UniqueId;
	fullname: string;
	permissions: Record<string, any>
	sites: Record<string, any>[]
	ttrace_division_id: UniqueId;
}

type Division = {
	id: UniqueId;
	name: string;
	fromAnyDivision: number;
	ttrace_ids: UniqueId[]
}

export const emptyUser: Readonly<User> = Object.freeze({id:-1,fio:'', rights:{}, groups: [], selected_group: -1});

interface IUserRepo {
	CheckLogin(): Promise<UserResponse>
	Logout(): Promise<AxiosResponse>
	GetUsersList(): Promise<ApiResponse<Person>>
	GetDivisions(): Promise<ApiResponse<Division>>
	GetPersonsByDivision(divisionId: Division['id']): Promise<ApiResponse<Person>>
}

export type { User, IUserRepo, Person, Division };