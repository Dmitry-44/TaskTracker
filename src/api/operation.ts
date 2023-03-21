import { envConfig } from "@/plugins/envConfig";
import type { FilterPayload } from "@/types";
import type { Operation } from "@/types/operation";
import { axiosClient } from "../plugins/axios";

export const GetAllOperations = (payload?: FilterPayload) => {
  return axiosClient.post(
    `${envConfig.API_URL}tasktracker/operations`,
    payload
  );
};

export const SendOperation = (payload: Partial<Operation> | Operation) => {
  const api = payload?.id
    ? `${envConfig.API_URL}tasktracker/operation/${payload?.id}`
    : `${envConfig.API_URL}tasktracker/pipe`;
  return axiosClient.put(api, payload);
};
