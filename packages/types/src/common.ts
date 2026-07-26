export type UUID = string;

export type ISODateString = string;

export type Nullable<T> = T | null;

export interface ApiError {
	message: string;
	code?: string;
}
