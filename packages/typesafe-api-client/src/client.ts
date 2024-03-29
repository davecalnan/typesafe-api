import { RoutesMap } from "@davekit/typesafe-api";
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

export const createApiClient = <Routes extends RoutesMap>({
  baseUrl,
  onRequest,
  onResponse,
}: {
  baseUrl: string | URL;
  /**
   * Called before the request is sent.
   */
  onRequest?: (args: { request: Request }) => void | Promise<void>;
  /**
   * Called after the response is received.
   */
  onResponse?: (args: {
    request: Request;
    response: any & { response: Response };
  }) => void | Promise<void>;
}) => {
  const headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
  });

  const call = async <
    Path extends keyof Routes,
    Method extends keyof Routes[Path],
    Body extends Routes[Path][Method] extends {
      body: infer BodyType;
    }
      ? BodyType
      : null,
    ResponseData = Routes[Path][Method] extends {
      response: infer ResponseType;
    }
      ? ResponseType
      : never
  >(
    path: Path,
    method: Method,
    body: Body
  ): Promise<ResponseData & { response: Response }> => {
    const request = new Request(new URL(path as string | URL, baseUrl).href, {
      method: method as ApiMethod,
      body: body ? JSON.stringify(body) : null,
      headers,
    });

    await onRequest?.({ request });

    const apiResponse = await fetch(request);

    const response = {
      ...(await apiResponse.json()),
      response: apiResponse,
    };

    await onResponse?.({ request, response });

    return response;
  };

  const get = async <
    Path extends keyof Routes,
    Query extends Routes[Path] extends {
      GET: {
        query: infer QueryType;
      };
    }
      ? QueryType
      : undefined
  >(
    path: Path,
    searchParams?: Query
  ) => {
    return call(
      addQueryString(
        path as string,
        searchParams as Record<string, string> | undefined
      ) as Path,
      "GET",
      null
    );
  };

  const post = async <
    Path extends keyof Routes,
    Body extends Routes[Path] extends {
      POST: {
        body: infer BodyType;
      };
    }
      ? BodyType
      : never
  >(
    path: Path,
    body: Body
  ) => {
    return call(
      path,
      "POST",
      /* @ts-expect-error */
      body
    );
  };

  const put = async <
    Path extends keyof Routes,
    Body extends Routes[Path] extends {
      PUT: {
        body: infer BodyType;
      };
    }
      ? BodyType
      : never
  >(
    path: Path,
    body: Body
  ) => {
    return call(
      path,
      "PUT",
      /* @ts-expect-error */
      body
    );
  };

  const patch = async <
    Path extends keyof Routes,
    Body extends Routes[Path] extends {
      PATCH: {
        body: infer BodyType;
      };
    }
      ? BodyType
      : never
  >(
    path: Path,
    body: Body
  ) => {
    return call(
      path,
      "PATCH",
      /* @ts-expect-error */
      body
    );
  };

  const deleteCall = async <Path extends keyof Routes>(path: Path) => {
    return call(path, "DELETE", null);
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
