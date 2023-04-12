import type { Operation } from '@/entities/operation';
import { isResultWithPagination, isSuccessApiResponse, type FilterPayload } from "@/api";
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

	fetchOperations (payload?: FilterPayload) {
		return this.operationRepo
			.GetOperations(payload)
			.then(respdata => {
				if (isSuccessApiResponse(respdata)) {
					if (payload?.filter!["id"]) {
						if (isResultWithPagination(respdata.result)) {
							this.operationStore.setSingleOperation(respdata.result.data[0]);
						} else {
							const payload =
							respdata.result.length > 0
								? respdata.result[0]
								: null;
								this.operationStore.setSingleOperation(payload);
						}
					} else {
						if (isResultWithPagination(respdata.result)) {
							this.operationStore.setOperations(respdata.result.data);
						} else {
							this.operationStore.setOperations(respdata.result);
						}
					}
					return true;
				} else {
					return respdata.message || -1;
				}
			})
			.catch(err => errRequestHandler(err))
	}

	sendOperation(payload: Partial<Operation>) {
		return this.operationRepo
			.SendOperation(payload)
			.then((respdata) => {
				if (isSuccessApiResponse(respdata)) {
					return true;
				} else {
					return respdata.message || -1;
				}
			})
			.catch(err => errRequestHandler(err));
	}
}
