import { axiosClient } from "@/plugins/axios";
import { envConfig } from "@/plugins/envConfig";
import type { UserResponse } from "@/types/api";
import type { IUserRepo } from "@/types/user";
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
}