import type { ApiResponse } from "./api";

export type Site = {
	id: UniqueId;
	url: string;
};

export interface ISiteRepo {
  	GetAll(): Promise<ApiResponse<Site>>
}