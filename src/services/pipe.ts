import { errRequestHandler, errVueHandler } from "@/plugins/errorResponser";
import { isSuccessApiResponse, type FilterPayload } from "@/api";
import type { IPipeRepo, Pipe } from "@/entities/pipe";
import type { IPipeStore } from "@/adapters";



export default class PipeService {
	pipeRepo;
	pipeStore;

	constructor(pipeRepo: IPipeRepo, pipeStore: IPipeStore) {
		this.pipeRepo = pipeRepo;
		this.pipeStore = pipeStore;
	}

	async fetchPipes (payload?: FilterPayload): Promise<boolean> {
		return this.pipeRepo.GetPipes(payload)
			.then(respdata => {
				if (isSuccessApiResponse(respdata)) {
					if (payload?.filter!["id"]) {
						const payload =
							respdata.result.length > 0
								? respdata.result[0]
								: null;
						this.pipeStore.setSinglePipe(payload);
					} else {
						this.pipeStore.setPipes(respdata.result);
					}
					return true;
				} else {
					return errVueHandler(respdata.message || -1)
				}
			})
			.catch(err => errRequestHandler(err))
	}

	async sendPipe(payload: Partial<Pipe>): Promise<boolean> {
		return this.pipeRepo
			.SendPipe(payload)
			.then((respdata) => {
				if (isSuccessApiResponse(respdata)) {
					return true;
				} else {
					return errVueHandler(respdata.message || -1)
				}
			})
			.catch(err => errRequestHandler(err));
	};
}