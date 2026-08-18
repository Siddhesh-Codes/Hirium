export interface ApiResult<T> {
  succes: boolean;
  message: string;
  data: T;
}

export interface ApiSimpleResult {
  succes: boolean;
  message: string;
}
