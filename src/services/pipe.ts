import { isResultWithPagination } from './../types/api';
import { GetAllPipes, SendPipe } from "@/api/pipe";
import { errRequestHandler, errVueHandler } from "@/plugins/errorResponser";
import { usePipeStore } from "@/stores/pipe";
import type { FilterPayload } from "@/types";
import { isSuccessApiResponse, type ApiResponse } from "@/types/api";
import type { Pipe } from "@/types/pipe";


const pipeStore = usePipeStore()

class PipeService {

    fetchPipes = (payload?: FilterPayload) => {
        return GetAllPipes(payload)
                .then(resp => {
                    const respdata: ApiResponse = resp.data;
                    if(isSuccessApiResponse(respdata)) {
                        if(payload?.filter!['id']) {
                            if(!isResultWithPagination(respdata.result)) {
                                const payload = respdata.result.length>0 ? respdata.result[0] as Pipe : null
                                pipeStore.setSinglePipe(payload)
                            }
                        } else {
                            if(isResultWithPagination(respdata.result)) {
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
    }

    sendPipe = (payload: Partial<Pipe>|Pipe) => {
        return SendPipe(payload)
            .then(resp => {
                const respdata: ApiResponse = resp.data;
                if(isSuccessApiResponse(respdata)) {
                    return true;
                } else {
                    return respdata.message || -1;
                }
            })
            .catch((e) => errRequestHandler(e));
    }
}

export const pipeService = new PipeService();
