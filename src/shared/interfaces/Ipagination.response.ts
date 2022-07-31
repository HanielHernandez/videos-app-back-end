import { PaginationParams } from './ipagination.params';

export interface PaginationResponse<I> extends PaginationParams {
  items: I[];
  totalPages: number;
  totalItems: number;
}
