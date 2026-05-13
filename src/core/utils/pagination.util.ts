import { SelectQueryBuilder } from 'typeorm';

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export async function paginate<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: PaginationOptions,
): Promise<PaginatedResult<T>> {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const [data, total] = await queryBuilder
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  const lastPage = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      lastPage,
    },
  };
}
