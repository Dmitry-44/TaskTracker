import { axiosClient } from "@/plugins/axios";
import { envConfig } from "@/plugins/envConfig";
import { errRequestHandler } from "@/plugins/errorResponser";
import type { ApiResponse, UserResponse } from "@/types/api";
import type { Division, IUserRepo, User, Person } from "@/types/user";
import { AxiosError, type AxiosResponse } from "axios";


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
    GetUsersList(): Promise<ApiResponse<Person>> {
        return axiosClient
            .get(`${envConfig.API_URL}tasktracker/users`)
            .then(resp=>resp.data)
    }
    GetDivisions(): Promise<ApiResponse<Division>> {
        return axiosClient
        .get(`${envConfig.API_URL}tasktracker/divisions`)
        .then(resp=>resp.data)
        .catch(err=> {
            if(err instanceof AxiosError) {
                throw err
            } else {
                return {message: errRequestHandler(err)}
            }
        })
    }
}