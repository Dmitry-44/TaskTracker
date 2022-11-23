import { errRequestHandler } from './../plugins/errorResponser';
import { envConfig } from './../plugins/envConfig';
import { axiosClient } from './../plugins/axios';
import { defineStore } from 'pinia';
import type { FilterPayload, ResultWithMessage } from './task';

type SimpleObject = {
    [key: string]: any;
}

type OperationsById = {
    [key: string]: Operation
}

interface Operation {
    id: number;
    name: string;
    params: SimpleObject;
}

const operationDefault: Operation = {
    id: -1,
    name: '',
    params: {}
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
        setSingleOperation(payload: Operation|null):void {
            this.singleOperation=payload
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
                        this.setSingleOperation(respdata.result)
                    } else {
                        this.setOperations(respdata.result);
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