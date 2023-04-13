import type { Operation } from '@/entities/operation';
import { isSuccessApiResponse, type FilterPayload } from "@/api";
import { errRequestHandler, errVueHandler } from "@/plugins/errorResponser";
import type { IOperationRepo } from '@/entities/operation';
import type PiniaOperationAdapter from '@/adapters/piniaOperationAdapter';


export default class OperationService {

	operationRepo;
	operationStore;

	constructor(operationRepo: IOperationRepo, operationStore: PiniaOperationAdapter) {
		this.operationRepo = operationRepo;
		this.operationStore = operationStore
	}

	async fetchOperations (payload?: FilterPayload): Promise<boolean> {
		return this.operationRepo
			.GetOperations(payload)
			.then(respdata => {
				if (isSuccessApiResponse(respdata)) {
					if (payload?.filter!["id"]) {
						const payload =
						respdata.result.length > 0
							? respdata.result[0]
							: null;
							this.operationStore.setSingleOperation(payload);
					} else {
						this.operationStore.setOperations(respdata.result);
					}
					return true;
				} else {
					return errVueHandler(respdata.message || -1)
				}
			})
			.catch(err => errRequestHandler(err))
	}

	async sendOperation(payload: Partial<Operation>): Promise<boolean> {
		return this.operationRepo
			.SendOperation(payload)
			.then((respdata) => {
				if (isSuccessApiResponse(respdata)) {
					return true;
				} else {
					return errVueHandler(respdata.message || -1)
				}
			})
			.catch(err => errRequestHandler(err));
	}
}
