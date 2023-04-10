import type { AxiosResponse } from "axios";
import type { ApiResponse, UserResponse } from "./api";

interface User {
	id: UniqueId;
	fio: string;
	rights: Record<string, any>
}

type UserSimple = {
	id: UniqueId;
	fullname: string;
	permissions: Record<string, any>
	sites: Record<string, any>[]
	ttrace_division_id: number;
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
	GetUsersList(): Promise<ApiResponse<UserSimple>>
	GetDivisions(): Promise<ApiResponse<Division>>
}

export type { User, IUserRepo, UserSimple, Division };