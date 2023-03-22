import { isResultWithPagination } from "../types/api";
import PipeApi from "@/api/pipe";
import { errRequestHandler, errVueHandler } from "@/plugins/errorResponser";
import { usePipeStore } from "@/stores/pipe";
import type { FilterPayload } from "@/types";
import { isSuccessApiResponse, type ApiResponse } from "@/types/api";
import type { IPipeRepo, Pipe } from "@/types/pipe";
import PipeRepo from "@/api/pipe";


const pipeStore = usePipeStore();

class PipeService {
	_pipeRepo;

	constructor(pipeRepo: IPipeRepo) {
		this._pipeRepo = pipeRepo;
	}

	fetchPipes = (payload?: FilterPayload) => this._pipeRepo.GetAllPipes(payload)

	fetchAndSetPipes = (payload?: FilterPayload) => {
		return this.fetchPipes(payload)
			.then(respdata => {
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
			.catch(err => errRequestHandler(err))
	}

	sendPipe = (payload: Partial<Pipe> | Pipe) => {
		return this._pipeRepo
			.SendPipe(payload)
			.then((respdata) => {
				if (isSuccessApiResponse(respdata)) {
					return true;
				} else {
					return respdata.message || -1;
				}
			})
			.catch(err => errRequestHandler(err));
	};
}

const pipeRepo = new PipeRepo();
export const pipeService = new PipeService(pipeRepo);