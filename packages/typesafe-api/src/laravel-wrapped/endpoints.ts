import { RequireId } from "core";
import { MakeUpsertData, PaginationQueryParameters } from "laravel";
import { PaginatedApiResponse, ApiResponse } from "./response";

export type IndexEndpoint<
  Path extends string,
  ResponseData extends { id: any } | null
> = {
  [path in Path]: {
    GET: {
      response: PaginatedApiResponse<
        ResponseData extends {} ? RequireId<ResponseData> : null
      >;
      query: PaginationQueryParameters<ResponseData>;
    };
  };
};

export type StoreEndpoint<
  Path extends string,
  ResponseData extends { id: any } | null,
  Payload = ResponseData extends {} ? MakeUpsertData<ResponseData> : null
> = {
  [path in Path]: {
    POST: {
      body: Payload;
      response: ApiResponse<
        ResponseData extends {} ? RequireId<ResponseData> : null
      >;
    };
  };
};

export type ShowEndpoint<
  Path extends string,
  ResponseData extends { id: any } | null
> = {
  [path in Path]: {
    GET: {
      response: ApiResponse<
        ResponseData extends {} ? RequireId<ResponseData> : null
      >;
    };
  };
};

export type UpdateEndpoint<
  Path extends string,
  ResponseData extends { id: any } | null,
  Payload = ResponseData extends {} ? MakeUpsertData<ResponseData> : null
> = {
  [path in Path]: {
    PUT: {
      body: Payload;
      response: ApiResponse<
        ResponseData extends {} ? RequireId<ResponseData> : null
      >;
    };
  };
};

export type DeleteEndpoint<
  Path extends string,
  ResponseData extends { id: any } | null
> = {
  [path in Path]: {
    DELETE: {
      response: ApiResponse<
        ResponseData extends {} ? { id: NonNullable<ResponseData["id"]> } : null
      >;
    };
  };
};

/**
 * Given a base path of `posts` will generate the following endpoints:
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
> = IndexEndpoint<BasePath, ResponseData> &
  StoreEndpoint<BasePath, ResponseData, UpsertData> &
  ShowEndpoint<ResourcePath, ResponseData> &
  UpdateEndpoint<ResourcePath, ResponseData, UpsertData> &
  DeleteEndpoint<ResourcePath, ResponseData>;

export { MakeUpsertData, PaginationQueryParameters };
