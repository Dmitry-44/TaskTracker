import { axiosClient } from "@/plugins/axios";
import { envConfig } from "@/plugins/envConfig";
import { errRequestHandler } from "@/plugins/errorResponser";
import { defineStore } from "pinia";

interface ResultWithMessage {
    message: string;
    result: any;
}

type Site = {
    id: number
    url: string
}

interface State {
    sites: Site[]
}

export const useSitesStore = defineStore({
    id: 'sites',
    state: (): State => ({
        sites: []
    }),
    getters: {
        getList: (state) => state.sites
    },
    actions: {
        setSites(payload: Site[]): void  {
            this.sites = payload
        },
        fetchSites():Promise<ResultWithMessage> {
            return axiosClient
            .get(`${envConfig.API_URL}api/sites/list`)
            .then((resp) => {
                const respdata: ResultWithMessage = resp.data;
                if (
                  Object.prototype.hasOwnProperty.call(respdata, "message") &&
                  respdata.message === "ok"
                ) {
                this.setSites(respdata.result);
                  return true;
                } else {
                  return respdata.message || -1;
                }
              })
              .catch((e) => errRequestHandler(e));
        }
    }
})