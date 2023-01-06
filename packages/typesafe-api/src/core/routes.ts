export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RoutesMap<
  Routes extends Record<string, Partial<Record<ApiMethod, Route>>> = Record<
    string,
    Partial<Record<ApiMethod, Route>>
  >
> = Routes;

export type Route = {
  query?: {};
  body?: {};
  response: {} | null;
};
