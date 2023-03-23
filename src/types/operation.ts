import type { FilterPayload } from ".";
import type { ApiResponse } from "./api";

type Operation = {
	id: number;
	name: string;
	params: { [key: string]: any };
}

interface IOperationRepo {
	GetOperations(payload?: FilterPayload): Promise<ApiResponse<Operation>>
	SendOperation(payload: Partial<Operation>): Promise<ApiResponse<Operation>>
}

export type { Operation, IOperationRepo };
