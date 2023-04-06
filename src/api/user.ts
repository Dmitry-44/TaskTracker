import { axiosClient } from "@/plugins/axios";
import { envConfig } from "@/plugins/envConfig";
import type { ApiResponse, UserResponse } from "@/types/api";
import type { IUserRepo, User, UserSimple } from "@/types/user";
import type { AxiosResponse } from "axios";


export default class UserRepo implements IUserRepo {
    CheckLogin(): Promise<UserResponse> {
        return axiosClient
            .get(`${envConfig.AUTH_URL}/auth/checkLogin`)
            .then(res => res.data)
    }
    Logout(): Promise<AxiosResponse> {
        return axiosClient
            .get(`${envConfig.AUTH_URL}/auth/logout`)
    }
    GetUsersList(): Promise<ApiResponse<UserSimple>> {
        return axiosClient
            .get(`${envConfig.API_URL}tasktracker/users`)
            .then(resp=>resp.data)
    }
}