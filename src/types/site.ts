import type { ApiResponse } from "./api";

export type Site = {
	id: number;
	url: string;
};

export interface ISiteRepo {
  	GetAll(): Promise<ApiResponse<Site>>
}