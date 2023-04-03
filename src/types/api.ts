import type { User } from "./user";

interface SuccessApiResponse<T> {
  message: string;
  result: ApiResult<T>;
}

type ResultWithPagination<T> = {
  pagination: { [key: string]: any };
  queryResult: T[];
};
interface FailureApiResponse {
  message: string;
  error?: string;
}

type UserResponse = {
	auth: User
}

type ApiResult<T> = ResultWithPagination<T> | T[];

type ApiResponse<T> = SuccessApiResponse<T> | FailureApiResponse;

//TYPE GUARDS
export const isSuccessApiResponse = <T>(res: ApiResponse<T>): res is SuccessApiResponse<T> => res.message === "ok";
export const isFailureApiResponse = <T>(res: ApiResponse<T>): res is FailureApiResponse => res.message != "ok";
export const isResultWithPagination = <T>(res: ApiResult<T>): res is ResultWithPagination<T> => res.hasOwnProperty("pagination");


interface FilterPayload {
	select: string[];
	filter: { [key: string]: any };
	options: {
		onlyLimit?: boolean;
		page?: number;
		itemsPerPage?: number;
		sortBy?: string[];
		sortDesc?: boolean[];
		groupBy?: string[];
		groupDesc?: boolean[];
		mustSort?: boolean;
		multiSort?: boolean;
		allCount?: number;
		maxPages?: number;
	};
}

export type { ApiResponse, SuccessApiResponse, FailureApiResponse, FilterPayload, UserResponse };
