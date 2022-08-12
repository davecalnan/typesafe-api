import { EndpointsMap } from "@davekit/typesafe-api";
import { ApiMethod } from "types";

const encodeSearchParams = (
  searchParams: Record<string, string | number | Date | null | undefined>
): string => {
  const params = Object.fromEntries(
    Object.entries(searchParams)
      .filter(([key, value]) => value != undefined)
      .map(([key, value]) => {
        if (value instanceof Date) {
          return [key, value.toISOString()];
        }

        return [key, value.toString()];
      })
  );

  return new URLSearchParams(params).toString();
};

const addQueryString = (
  path: string,
  searchParams?: Record<string, string>
) => {
  if (!searchParams) return path;

  const queryString = encodeSearchParams(searchParams);

  if (queryString) {
    return `${path}?${queryString}`;
  }

  return path;
};

export const createApiClient = <Endpoints extends EndpointsMap>({
  baseUrl,
}: {
  baseUrl: string | URL;
}) => {
  const headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
  });

  const call = async <
    Endpoint extends keyof Endpoints,
    Method extends keyof Endpoints[Endpoint],
    Body extends Endpoints[Endpoint][Method] extends {
      body: infer BodyType;
    }
      ? BodyType
      : null,
    ResponseData = Endpoints[Endpoint][Method] extends {
      response: infer ResponseType;
    }
      ? ResponseType
      : never
  >(
    endpoint: Endpoint,
    method: Method,
    body: Body
  ): Promise<ResponseData & { response: Response }> => {
    const response = await fetch(
      new URL(endpoint as string | URL, baseUrl).href,
      {
        method: method as ApiMethod,
        body: body ? JSON.stringify(body) : null,
        headers,
      }
    );

    return {
      ...(await response.json()),
      response,
    };
  };

  const get = async <
    Endpoint extends keyof Endpoints,
    Query extends Endpoints[Endpoint] extends {
      GET: {
        query: infer QueryType;
      };
    }
      ? QueryType
      : undefined
  >(
    endpoint: Endpoint,
    searchParams?: Query
  ) => {
    return call(
      addQueryString(
        endpoint as string,
        searchParams as Record<string, string> | undefined
      ) as Endpoint,
      "GET",
      null
    );
  };

  const post = async <
    Endpoint extends keyof Endpoints,
    Body extends Endpoints[Endpoint] extends {
      POST: {
        body: infer BodyType;
      };
    }
      ? BodyType
      : never
  >(
    endpoint: Endpoint,
    body: Body
  ) => {
    return call(
      endpoint,
      "POST",
      /* @ts-expect-error */
      body
    );
  };

  const put = async <
    Endpoint extends keyof Endpoints,
    Body extends Endpoints[Endpoint] extends {
      PUT: {
        body: infer BodyType;
      };
    }
      ? BodyType
      : never
  >(
    endpoint: Endpoint,
    body: Body
  ) => {
    return call(
      endpoint,
      "PUT",
      /* @ts-expect-error */
      body
    );
  };

  const patch = async <
    Endpoint extends keyof Endpoints,
    Body extends Endpoints[Endpoint] extends {
      PATCH: {
        body: infer BodyType;
      };
    }
      ? BodyType
      : never
  >(
    endpoint: Endpoint,
    body: Body
  ) => {
    return call(
      endpoint,
      "PATCH",
      /* @ts-expect-error */
      body
    );
  };

  const deleteCall = async <Endpoint extends keyof Endpoints>(
    endpoint: Endpoint
  ) => {
    return call(endpoint, "DELETE", null);
  };

  return {
    call,
    get,
    post,
    put,
    patch,
    delete: deleteCall,
    headers,
  };
};
