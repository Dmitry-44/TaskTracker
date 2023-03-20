

interface SuccessApiResponse {
    message: string,
    result: ApiResult
}

type ResultWithPagination = {
    pagination: {[key: string]: any}
    queryResult: any[]
}
interface FailureApiResponse {
    message: string,
    result?: unknown;
}

type ApiResult = ResultWithPagination | any[]

type ApiResponse = SuccessApiResponse | FailureApiResponse


//TYPE GUARDS
export const isSuccessApiResponse = (res: ApiResponse): res is SuccessApiResponse => res.message === 'ok'
export const isFailureApiResponse = (res: ApiResponse): res is FailureApiResponse => res.message != 'ok'
export const isResultWithPagination = (res: ApiResult): res is ResultWithPagination => res.hasOwnProperty('pagination')

export type { ApiResponse, SuccessApiResponse, FailureApiResponse }