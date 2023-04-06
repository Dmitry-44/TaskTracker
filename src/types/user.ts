import type { AxiosResponse } from "axios";
import type { ApiResponse, UserResponse } from "./api";

interface User {
	id: number;
	fio: string;
	rights: Record<string, any>
}

type UserSimple = {
	id: number;
	fullname: string;
	permissions: Record<string, any>
	sites: Record<string, any>[]
	ttrace_division_id: number;
}

interface IUserRepo {
	CheckLogin(): Promise<UserResponse>
	Logout(): Promise<AxiosResponse>
	GetUsersList(): Promise<ApiResponse<UserSimple>>
}

export type { User, IUserRepo, UserSimple };