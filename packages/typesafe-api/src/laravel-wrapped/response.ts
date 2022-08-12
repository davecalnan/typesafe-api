export type ApiStatus = "SUCCESS" | "ERROR";

interface BaseApiResponse {
  status: ApiStatus;
  data: unknown;
  meta: {};
}

export interface SuccessfulApiResponse<Data, Meta = {}>
  extends BaseApiResponse {
  status: "SUCCESS";
  data: Data;
  meta: Meta;
}

export interface ErrorApiResponse<
  Data = null,
  Meta = {
    message: string;
    errors?: Record<string, string>;
  }
> extends BaseApiResponse {
  status: "ERROR";
  data: Data | null;
  meta: Meta;
}

export type ApiResponse<Data = any> =
  | SuccessfulApiResponse<Data>
  | ErrorApiResponse;

export interface SuccessfulPaginatedApiResponse<Item = any>
  extends BaseApiResponse {
  data: Item[];
  meta: {
    pagination: {
      current_page: number;
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
    };
  };
}

export type PaginatedApiResponse<Item = any> =
  | SuccessfulPaginatedApiResponse<Item>
  | ErrorApiResponse;
