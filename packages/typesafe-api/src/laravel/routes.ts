import { RequireIdIfPresent } from "core";

export type MakeUpsertData<Data extends { id: any }> = Omit<
  Data,
  "id" | "created_at" | "updated_at" | "deleted_at"
>;

export type PaginationQueryParameters<Data = Record<string, string>> = {} & {
  /**
   * Allow string for easier use with query parameters.
   */
  page?: number | string;
  per_page?: number;
  sort_by?: keyof Data;
  sort_direction?: "asc" | "desc";
};

export type IndexRoute<
  Path extends string,
  ResponseData extends { id: any } | null
> = {
  [path in Path]: {
    GET: {
      response: RequireIdIfPresent<ResponseData>;
      query: PaginationQueryParameters<ResponseData>;
    };
  };
};

export type StoreRoute<
  Path extends string,
  ResponseData extends { id: any } | null,
  Payload = ResponseData extends {} ? MakeUpsertData<ResponseData> : null
> = {
  [path in Path]: {
    POST: {
      body: Payload;
      response: RequireIdIfPresent<ResponseData>;
    };
  };
};

export type ShowRoute<
  Path extends string,
  ResponseData extends { id: any } | null
> = {
  [path in Path]: {
    GET: {
      response: RequireIdIfPresent<ResponseData>;
    };
  };
};

export type UpdateRoute<
  Path extends string,
  ResponseData extends { id: any } | null,
  Payload = ResponseData extends {} ? MakeUpsertData<ResponseData> : null
> = {
  [path in Path]: {
    PUT: {
      body: Payload;
      response: RequireIdIfPresent<ResponseData>;
    };
  };
};

export type DeleteRoute<
  Path extends string,
  ResponseData extends { id: any } | null
> = {
  [path in Path]: {
    DELETE: {
      response: RequireIdIfPresent<ResponseData>;
    };
  };
};

/**
 * Given a base path of `posts` will generate the following routes:
 * - GET `posts`
 * - POST `posts`
 * - GET `posts/${number}`
 * - PUT `posts/${number}`
 * - DELETE `posts/${number}`
 */
export type ApiResource<
  BasePath extends string,
  ResponseData extends { id: any },
  ResourcePath extends `${BasePath}/${number}` = `${BasePath}/${number}`,
  UpsertData = MakeUpsertData<ResponseData>
> = IndexRoute<BasePath, ResponseData> &
  StoreRoute<BasePath, ResponseData, UpsertData> &
  ShowRoute<ResourcePath, ResponseData> &
  UpdateRoute<ResourcePath, ResponseData, UpsertData> &
  DeleteRoute<ResourcePath, ResponseData>;
