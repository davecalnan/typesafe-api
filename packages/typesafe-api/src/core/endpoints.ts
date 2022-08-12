export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type EndpointsMap<
  Endpoints extends Record<
    string,
    Partial<Record<ApiMethod, ApiEndpoint>>
  > = Record<string, Partial<Record<ApiMethod, ApiEndpoint>>>
> = Endpoints;

export type ApiEndpoint = {
  query?: {};
  body?: {};
  response: {};
};
