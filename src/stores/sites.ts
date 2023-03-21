import { axiosClient } from "@/plugins/axios";
import { envConfig } from "@/plugins/envConfig";
import { errRequestHandler } from "@/plugins/errorResponser";
import type { Site } from "@/types/site";
import type { ResultWithMessage } from "@/types/index";
import { defineStore } from "pinia";
import { GetAllSites } from "@/api/site";
import { isSuccessApiResponse, type ApiResponse } from "@/types/api";

interface State {
  sites: Site[];
}

export const useSitesStore = defineStore({
  id: "sites",
  state: (): State => ({
    sites: [],
  }),
  getters: {
    getList: (state) => state.sites,
  },
  actions: {
    setSites(payload: Site[]): void {
      this.sites = payload;
    },
    fetchSites() {
      return GetAllSites()
        .then((resp) => {
          const respdata: ApiResponse = resp.data;
          if (isSuccessApiResponse(respdata)) {
            this.setSites(respdata.result as Site[]);
            return true;
          } else {
            return respdata.message || -1;
          }
        })
        .catch((e) => errRequestHandler(e));
    },
  },
});
