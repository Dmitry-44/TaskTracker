import { ElMessage } from 'element-plus';
import type { Operation } from '@/entities/operation';
import { isSuccessApiResponse, type FilterPayload } from "@/api";
import { errRequestHandler, errVueHandler } from "@/plugins/errorResponser";
import type { IOperationRepo } from '@/entities/operation';
import type { IOperationStore } from '@/adapters';


export default class OperationService {

	operationRepo;
	operationStore;

	constructor(operationRepo: IOperationRepo, operationStore: IOperationStore) {
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
		ElMessage({
			message: "Сохраняю операцию..",
			type: "success",
			center: true,
			duration: 1000,
		});
		return this.operationRepo
			.SendOperation(payload)
			.then((respdata) => {
				if (isSuccessApiResponse(respdata)) {
					ElMessage({
						message: "Операция сохранена!",
						type: "success",
						center: true,
						duration: 2000,
					});
					return true;
				} else {
					return errVueHandler(respdata.message || -1)
				}
			})
			.catch(err => {
				ElMessage({
					message: "Что-то пошло не так...",
					type: "error",
					center: true,
					duration: 1500,
					showClose: true,
				});
				return false
			})
	}
}
