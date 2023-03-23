import type { Operation } from '@/types/operation';
import { isResultWithPagination } from "../types/api";
import { errRequestHandler, errVueHandler } from "@/plugins/errorResponser";
import type { FilterPayload } from "@/types";
import { isSuccessApiResponse, type ApiResponse } from "@/types/api";
import type { IOperationRepo } from '@/types/operation';
import { useOperationStore } from '@/stores/operation';


const operationStore = useOperationStore()

export default class OperationService {

	operationRepo;

	constructor(operationRepo: IOperationRepo) {
		this.operationRepo = operationRepo;
	}

	fetchOperations (payload?: FilterPayload) {
		return this.operationRepo
			.GetOperations(payload)
			.then(respdata => {
				if (isSuccessApiResponse(respdata)) {
					if (payload?.filter!["id"]) {
						if (isResultWithPagination(respdata.result)) {
							operationStore.setSingleOperation(respdata.result.queryResult[0]);
						} else {
							const payload =
							respdata.result.length > 0
								? respdata.result[0]
								: null;
								operationStore.setSingleOperation(payload);
						}
					} else {
						if (isResultWithPagination(respdata.result)) {
							operationStore.setOperations(respdata.result.queryResult);
						} else {
							operationStore.setOperations(respdata.result);
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
