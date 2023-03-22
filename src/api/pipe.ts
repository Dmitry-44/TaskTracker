import { envConfig } from "@/plugins/envConfig";
import type { FilterPayload } from "@/types";
import type { ApiResponse } from "@/types/api";
import type { IPipeRepo, Pipe } from "@/types/pipe";
import type { AxiosResponse } from "axios";
import { axiosClient } from "../plugins/axios";

export default class PipeRepo implements IPipeRepo {
  GetAllPipes(payload?: FilterPayload) {
    return axiosClient
      .post(`${envConfig.API_URL}tasktracker/pipe`, payload)
      .then((res) => res.data as ApiResponse)
  }

  SendPipe(payload: Partial<Pipe> | Pipe) {
    const api = payload?.id
      ? `${envConfig.API_URL}tasktracker/pipe/${payload?.id}`
      : `${envConfig.API_URL}tasktracker/pipe`;
    return axiosClient.put(api, payload).then((res) => res.data as ApiResponse);
  }
}
