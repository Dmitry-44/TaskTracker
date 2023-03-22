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
  GetAllPipes(payload?: FilterPayload): Promise<ApiResponse>;
  SendPipe(payload: Partial<Pipe> | Pipe): Promise<ApiResponse>;
}

export type { Pipe, IPipeRepo };
