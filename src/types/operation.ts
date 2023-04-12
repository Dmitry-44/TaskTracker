import type { ApiResponse, FilterPayload } from "./api";

type Operation = {
	id: UniqueId;
	name: string;
	params: Record<string, any>
}

interface IOperationRepo {
	GetOperations(payload?: FilterPayload): Promise<ApiResponse<Operation>>
	SendOperation(payload: Partial<Operation>): Promise<ApiResponse<Operation>>
}

export type { Operation, IOperationRepo };
