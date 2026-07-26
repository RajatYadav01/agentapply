import type { ApiError } from "./common.ts";

export interface ApiResponse<T> {
	success: boolean;
	data: T;
	error: ApiError | null;
}

export interface Pagination {
	page: number;
	pageSize: number;
	total: number;
}

export interface PaginatedResponse<T> {
	items: T[];
	pagination: Pagination;
}
