import type { Operation } from '@/types/operation';
import { isResultWithPagination, type FilterPayload } from "../types/api";
import { errRequestHandler, errVueHandler } from "@/plugins/errorResponser";
import { isSuccessApiResponse, type ApiResponse } from "@/types/api";
import type { IOperationRepo } from '@/types/operation';
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
							this.operationStore.setSingleOperation(respdata.result.queryResult[0]);
						} else {
							const payload =
							respdata.result.length > 0
								? respdata.result[0]
								: null;
								this.operationStore.setSingleOperation(payload);
						}
					} else {
						if (isResultWithPagination(respdata.result)) {
							this.operationStore.setOperations(respdata.result.queryResult);
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
