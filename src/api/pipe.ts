import { envConfig } from '@/plugins/envConfig';
import type { FilterPayload } from '@/types';
import type { ApiResponse } from '@/types/api';
import type { Pipe } from '@/types/pipe';
import { axiosClient } from '../plugins/axios';



export const GetAllPipes = (payload?: FilterPayload) => {
    return axiosClient.post(`${envConfig.API_URL}tasktracker/pipe`, payload)
}

export const SendPipe = (payload: Partial<Pipe>|Pipe) => {
    const api = payload?.id ? `${envConfig.API_URL}tasktracker/pipe/${payload?.id}` : `${envConfig.API_URL}tasktracker/pipe`
    return axiosClient.put(api, payload)
}