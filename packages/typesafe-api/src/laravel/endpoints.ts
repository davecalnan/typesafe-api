import { RequireIdIfPresent } from "core";

export type MakeUpsertData<Data extends { id: any }> = Omit<
  Data,
  "id" | "created_at" | "updated_at" | "deleted_at"
>;

export type PaginationQueryParameters<Data = Record<string, string>> = {} & {
  sort_by: keyof Data;
  sort_direction: "asc" | "desc";
};

export type IndexEndpoint<
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

export type StoreEndpoint<
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

export type ShowEndpoint<
  Path extends string,
  ResponseData extends { id: any } | null
> = {
  [path in Path]: {
    GET: {
      response: RequireIdIfPresent<ResponseData>;
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
      response: RequireIdIfPresent<ResponseData>;
    };
  };
};

export type DeleteEndpoint<
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
