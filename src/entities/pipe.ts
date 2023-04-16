import type { Operation } from "@/entities/operation";
import type { ApiResponse, FilterPayload } from "@/api";

interface Pipe {
	id: UniqueId;
	name: string;
	operation_entities: Operation[];
	value: number[];
}

interface IPipeRepo {
	GetPipes(payload?: FilterPayload): Promise<ApiResponse<Pipe>>;
	SendPipe(payload: Partial<Pipe>): Promise<ApiResponse<Pipe>>;
}

export type { Pipe, IPipeRepo }