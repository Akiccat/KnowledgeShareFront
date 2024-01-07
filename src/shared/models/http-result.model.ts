import { HttpResultStatus } from '../constants/http-result-status.constant';

interface ResultError {
  message: string;
  field?: string;
}

export interface HttpResult {
  status: HttpResultStatus;
  result: any;
  errors: ResultError[];
}
