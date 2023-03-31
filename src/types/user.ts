import type { AxiosResponse } from "axios";
import type { UserResponse } from "./api";

interface User {
	id: number;
	fio: string;
	rights: { [key: string]: any };
}

interface IUserRepo {
	CheckLogin(): Promise<UserResponse>
	Logout(): Promise<AxiosResponse>
}

export type { User, IUserRepo };