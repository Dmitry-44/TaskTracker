import { envConfig } from "@/plugins/envConfig";
import { axiosClient } from "../plugins/axios";

export const GetAllSites = () => {
  return axiosClient.get(`${envConfig.API_URL}api/sites/list`);
};
