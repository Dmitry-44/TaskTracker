

interface SuccessApiResponse {
    message: string,
    result: {
        queryResult?: unknown[]
    }
}
interface FailureApiResponse {
    message: string,
    result?: unknown;
}
type ApiResponse = SuccessApiResponse | FailureApiResponse

//TYPE GUARDS
export const isSuccessApiResponse = (res: ApiResponse): res is SuccessApiResponse => res.message === 'ok'
export const isFailureApiResponse = (res: ApiResponse): res is FailureApiResponse => res.message != 'ok'

export type { ApiResponse, SuccessApiResponse, FailureApiResponse }