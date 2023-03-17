import { errRequestHandler } from './../plugins/errorResponser';
import { envConfig } from './../plugins/envConfig';
import { axiosClient } from './../plugins/axios';
import { defineStore } from 'pinia';
import type { Operation } from "@/types/operation";
import type { FilterPayload, ResultWithMessage } from "@/types/index";


type OperationsById = {
    [key: string]: Operation
}

type State = {
    operations: Operation[];
    singleOperation: Operation | null
}

export const useOperationStore = defineStore({
    id: "operation",
    state: (): State => ({
        operations: [],
        singleOperation: null
    }),
    getters: {
        getOperations: (state) => state.operations,
        getSingleOperation: (state)=> state.singleOperation,
        getOperationsById:(state): OperationsById => state.operations.reduce((acc,el) => {
            acc[el?.id!] = el
            return acc
          },{} as OperationsById),
    },
    actions: {
        setOperations(payload: Operation[]):void {
            this.operations=payload
        },
        setSingleOperation(payload: Operation[]|null):void {
            this.singleOperation = payload===null ? null : payload[0]
        },
        fetchOperations(payload?: FilterPayload): Promise<any> {
            return axiosClient
                .post(`${envConfig.API_URL}tasktracker/operations`, payload)
                .then((resp) => {
                const respdata: ResultWithMessage = resp.data;
                if (
                    Object.prototype.hasOwnProperty.call(respdata, "message") &&
                    respdata.message === "ok"
                ) {
                    if(payload?.filter['id']) {
                        this.setSingleOperation(respdata.result as Operation[])
                    } else {
                        this.setOperations(respdata.result as Operation[]);
                    }
                    return true;
                } else {
                    return respdata.message || -1;
                }
                })
                .catch((e) => errRequestHandler(e));
        },
        sendOperation(payload: Partial<Operation>): Promise<any> {
            const api = payload?.id ? `${envConfig.API_URL}tasktracker/operation/${payload?.id}` : `${envConfig.API_URL}tasktracker/operation`
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