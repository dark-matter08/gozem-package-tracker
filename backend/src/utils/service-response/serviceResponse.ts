export default class ServiceResponse<T> {
  message?: string;
  status?: number;
  data?: T[] | T;
}
