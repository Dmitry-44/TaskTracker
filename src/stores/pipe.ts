import { errRequestHandler } from '../plugins/errorResponser';
import { envConfig } from '../plugins/envConfig';
import { axiosClient } from '../plugins/axios';
import { defineStore } from 'pinia';
import type { Pipe } from "@/types/pipe";
import type { FilterPayload, ResultWithMessage } from "@/types/index";


type State = {
    pipes: Pipe[];
    singlePipe: Pipe | null
}

export const usePipeStore = defineStore({
    id: "pipe",
    state: (): State => ({
        pipes: [],
        singlePipe: null
    }),
    getters: {
        getPipes: (state) => state.pipes,
        getSinglePipe: (state)=> state.singlePipe,
    },
    actions: {
        setPipes(payload: Pipe[]):void {
            this.pipes=payload
        },
        setSinglePipe(payload: Pipe[]|null):void {
            this.singlePipe = payload===null ? null : payload[0]
        },
        fetchPipes(payload?: FilterPayload): Promise<any> {
            return axiosClient
                .post(`${envConfig.API_URL}tasktracker/pipe`, payload)
                .then((resp) => {
                const respdata: ResultWithMessage = resp.data;
                if (
                    Object.prototype.hasOwnProperty.call(respdata, "message") &&
                    respdata.message === "ok"
                ) {
                    if(payload?.filter['id']) {
                        this.setSinglePipe(respdata.result as Pipe[])
                    } else {
                        this.setPipes(respdata.result as Pipe[]);
                    }
                    return true;
                } else {
                    return respdata.message || -1;
                }
                })
                .catch((e) => errRequestHandler(e));
        },
        sendPipe(payload: Partial<Pipe>): Promise<any> {
            const api = payload?.id ? `${envConfig.API_URL}tasktracker/pipe/${payload?.id}` : `${envConfig.API_URL}tasktracker/pipe`
            return axiosClient
              .put(api, payload)
              .then((resp) => {
                const respdata: ResultWithMessage = resp.data
                if (
                  Object.prototype.hasOwnProperty.call(respdata, "message") &&
                  respdata.message === "ok"
                ) {
                  return true;
                } else {
                  return respdata.message || -1;
                }
              })
              .catch((e) => errRequestHandler(e));
          },
    }
})