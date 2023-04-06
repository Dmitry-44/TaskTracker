import type { AxiosResponse } from "axios";
import type { ApiResponse, UserResponse } from "./api";

interface User {
	id: number;
	fio: string;
	rights: { [key: string]: any };
}

type UserSimple = {
	id: number;
	fullname: string;
	permissions: { [key: string]: any}
	sites: {[key: string]: any}[]
	ttrace_division_id: number;
}

interface IUserRepo {
	CheckLogin(): Promise<UserResponse>
	Logout(): Promise<AxiosResponse>
	GetUsersList(): Promise<ApiResponse<UserSimple>>
}

export type { User, IUserRepo, UserSimple };