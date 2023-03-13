import { ElMessage } from 'element-plus';
import { defineStore } from 'pinia';

interface SimpleObject {
    [key: string]: any;
}

interface FilterPayload {
    select: string[];
    filter: SimpleObject;
    options: {
      onlyLimit: boolean;
      page?: number;
      itemsPerPage: number;
      sortBy?: string[];
      sortDesc?: boolean[];
      groupBy?: string[];
      groupDesc?: boolean[];
      mustSort?: boolean;
      multiSort?: boolean;
      allCount?: number;
      maxPages?: number;
    };
}

interface SuccessApiResponse {
    message: string,
    result: {
        queryResult?: unknown[]
    };
}

interface FailureApiResponse {
    message: string,
    result?: unknown;
}

type ApiResponse = SuccessApiResponse | FailureApiResponse

interface ResultWithMessage {
    message: string;
    result: any;
  }

type State = {
    detailWindowIsOpen: boolean,
    isCreatingTaskProcess: boolean,
}

export const isSuccessApiResponse = (res: ApiResponse): res is SuccessApiResponse => res.message === 'ok'
export const isFailureApiResponse = (res: ApiResponse): res is FailureApiResponse => res.message != 'ok'


export type {SimpleObject, FilterPayload, ResultWithMessage, ApiResponse}

export const useInterfaceStore = defineStore({
    id: "interface",
    state:(): State => ({
        detailWindowIsOpen: false,
        isCreatingTaskProcess: false
    }),
    getters: {
        getIsCreatingTaskProcess:(state) => state.isCreatingTaskProcess,
        getDetailWindowIsOpen:(state) => state.detailWindowIsOpen
    },
    actions: {
        toggleDetailsWindow(bool: boolean): void {
            this.detailWindowIsOpen = bool
          },
        toggleCreatingTaskProcess(bool: boolean):void {
            this.isCreatingTaskProcess=bool
        }
    }
})