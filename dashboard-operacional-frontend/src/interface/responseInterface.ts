export interface ResponseApi<T> {
  isSuccess: boolean;
  errorMessage?: string;
  response?: T;
}
