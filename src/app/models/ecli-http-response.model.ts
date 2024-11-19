export interface EcliHttpResponse<T> {
    message: string;
    data: T;
    success: boolean;
}
