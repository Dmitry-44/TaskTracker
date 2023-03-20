import { errRequestHandler } from './../plugins/errorResponser';
import { envConfig } from './../plugins/envConfig';
import { axiosClient } from './../plugins/axios';
import { defineStore } from 'pinia';
import type { Operation } from "@/types/operation";
import type { FilterPayload, ResultWithMessage } from "@/types/index";
import { GetAllOperations, SendOperation } from '@/api/operation';
import { isSuccessApiResponse, type ApiResponse } from '@/types/api';


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
        setOperations(payload: Operation[]) {
            this.operations=payload
        },
        setSingleOperation(payload: Operation[]|null) {
            this.singleOperation = payload===null ? null : payload[0]
        },
        fetchOperations(payload?: FilterPayload){
            return GetAllOperations(payload)
                .then(resp => {
                    const respdata: ApiResponse = resp.data;
                    if(isSuccessApiResponse(respdata)) {
                        if(payload?.filter!['id']) {
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
        sendOperation(payload: Partial<Operation>){
            return SendOperation(payload)
              .then(resp => {
                const respdata: ApiResponse = resp.data;
                if(isSuccessApiResponse(respdata)) {
                    return true;
                } else {
                    return respdata.message || -1;
                }
              })
              .catch((e) => errRequestHandler(e));
          },
    }
})