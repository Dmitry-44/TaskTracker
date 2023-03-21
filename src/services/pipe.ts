import { isResultWithPagination } from "./../types/api";
import PipeApi from "@/api/pipe";
import { errRequestHandler, errVueHandler } from "@/plugins/errorResponser";
import { usePipeStore } from "@/stores/pipe";
import type { FilterPayload } from "@/types";
import { isSuccessApiResponse, type ApiResponse } from "@/types/api";
import type { Pipe } from "@/types/pipe";

export interface IPipeApi {
  GetAllPipes(payload?: FilterPayload): Promise<ApiResponse>;
  SendPipe(payload: Partial<Pipe> | Pipe): Promise<ApiResponse>;
}

const pipeStore = usePipeStore();

class PipeService {
  _pipeApi;

  constructor(pipeApi: IPipeApi) {
    this._pipeApi = pipeApi;
  }

  fetchPipes = (payload?: FilterPayload) => {
    return this._pipeApi
      .GetAllPipes(payload)
      .then((respdata) => {
        if (isSuccessApiResponse(respdata)) {
          if (payload?.filter!["id"]) {
            if (!isResultWithPagination(respdata.result)) {
              const payload =
                respdata.result.length > 0
                  ? (respdata.result[0] as Pipe)
                  : null;
              pipeStore.setSinglePipe(payload);
            }
          } else {
            if (isResultWithPagination(respdata.result)) {
              pipeStore.setPipes(respdata.result.queryResult as Pipe[]);
            } else {
              pipeStore.setPipes(respdata.result as Pipe[]);
            }
          }
          return true;
        } else {
          return respdata.message || -1;
        }
      })
      .catch((e) => errRequestHandler(e));
  };

  sendPipe = (payload: Partial<Pipe> | Pipe) => {
    return this._pipeApi
      .SendPipe(payload)
      .then((respdata) => {
        if (isSuccessApiResponse(respdata)) {
          return true;
        } else {
          return respdata.message || -1;
        }
      })
      .catch((e) => errRequestHandler(e));
  };
}

const pipeApi = new PipeApi();
export const pipeService = new PipeService(pipeApi);
