import type { AxiosResponse } from "axios";
import type { ApiResponse, UserResponse } from "./api";

type User = {
	id: UniqueId;
	fio: string;
	rights: Record<string, any>
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
}

export const emptyUser: Readonly<User> = Object.freeze({id:-1,fio:'', rights:{}});

interface IUserRepo {
	CheckLogin(): Promise<UserResponse>
	Logout(): Promise<AxiosResponse>
	GetUsersList(): Promise<ApiResponse<Person>>
	GetDivisions(): Promise<ApiResponse<Division>>
}

export type { User, IUserRepo, Person, Division };