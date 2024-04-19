// TODO: use `ServiceResponse<T> with data: T[] | T` in the next release.
export default class ServiceResponse<T> {
  message?: string;
  status?: number;
  data?: T;
}
