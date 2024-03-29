import { axiosClient } from "@/plugins/axios";
import { envConfig } from "@/plugins/envConfig";
import { errRequestHandler } from "@/plugins/errorResponser";
import type { ApiResponse, UserResponse } from "@/api";
import type { Division, IUserRepo, User, Person } from "@/entities/user";
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
    GetUsersList(): Promise<ApiResponse<Person>> {
        return axiosClient
            .get(`${envConfig.API_URL}tasktracker/users`)
            .then(resp=>resp.data)
            .catch(err=> {
				return { message: errRequestHandler(err)}
			})
    }
    GetDivisions(): Promise<ApiResponse<Division>> {
        return axiosClient
        .get(`${envConfig.API_URL}tasktracker/divisions`)
        .then(resp=>resp.data)
        .catch(err=> {
            return { message: errRequestHandler(err)}
        })
    }
    GetPersonsByDivision(divisionId: number): Promise<ApiResponse<Person>> {
        return axiosClient
        .get(`${envConfig.API_URL}tasktracker/divisions/${divisionId}/users`)
        .then(resp=>resp.data)
        .catch(err=> {
            return { message: errRequestHandler(err)}
        })
    }
}