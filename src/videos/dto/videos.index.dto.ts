import { PaginationParams } from 'src/shared/interfaces';

export interface VideosIndexDTO extends PaginationParams {
  userId: number | string;
  forUser?: boolean;
}
