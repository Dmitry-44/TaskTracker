import type { Operation } from "@/types/operation";
import type { FilterPayload } from ".";
import type { ApiResponse } from "./api";

interface Pipe {
  id: number;
  name: string;
  operation_entities: Operation[];
  value: number[];
}

interface IPipeRepo {
  GetPipes(payload?: FilterPayload): Promise<ApiResponse<Pipe>>;
  SendPipe(payload: Partial<Pipe> | Pipe): Promise<ApiResponse<Pipe>>;
}

export type { Pipe, IPipeRepo };
