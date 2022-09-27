# @davekit/typesafe-api

> A tiny (520 byte!) library to ensure type safety from backend to frontend (and back again).

## In a nutshell

On your backend, define your api endpoints with TypeScript:

```ts
// api-routes.ts
import type { RoutesMap } from "@davekit/typesafe-api";

type Post = {
  id: number;
  content: string;
};

export type ApiRoutes = RoutesMap<{
  posts: {
    GET: {
      response: Post[];
      query?: { sort: "oldest-first" | "newest-first" };
    };
    POST: {
      body: Omit<Post, "id">;
      response: Post;
    };
  };
}>;
```

On your frontend, import those routes and provide them to an API client:

```ts
// api-client.ts
import { createApiClient } from "@davekit/typesafe-api-client";
import type { ApiRoutes } from "../backend/api-routes";

const api = createApiClient<ApiRoutes>({
  baseUrl: process.env.API_ENDPOINT,
});

api
  .get(
    "posts", /* 1️⃣ */
    { sort: "oldest-first" } /* 2️⃣ */
  )
  .then((post) => {
    /* 3️⃣ */
  });

// 1. Knows that GET /posts is a valid endpoint
// 2. Knows that a `?sort=oldest-first` is a valid query string
// 3. Knows that the return type is `Post[]`

api
  .post(
    "posts", /* 1️⃣ */
    { content: "Hello world" } /* 2️⃣ */
  )
  .then((post) => {
    /* 3️⃣ */
  });

// 1. Knows that POST /posts is a valid endpoint
// 2. Knows that the body must be `Omit<Post, "id">`
// 3. Knows that the return type is `Post`

// ❌ Type error as GET /psots is not a valid endpoint
const badPath = await api.get("psots");

// ❌ Type error as DELETE /posts is not a valid endpoint
const badMethod = await api.delete("posts");

// ❌ Type error as payload does not match type `Omit<Post,"id">;`
const badBody = await api.post("posts", { text: "Hello World" });

// ❌ Type error as `?order=oldest-first is not a valid query string
const badQuery = await api.get("posts", { order: "oldest-first" });
```

## The Problem

I like using TypeScript to write my frontend apps. Often I need to send data to and from a backend. Ideally I want type safety when sending and receiving data.

My first attempts at this usually involved creating a sprawling API client. Things like:

```ts
const api = {
  posts: {
    index: () => client.get("posts") as Promise<Post[]>,

    store: (data: Omit<Post, "id">) =>
      client.post("posts", data) as Promise<Post>,

    show: (id: number) => client.get(`posts/${id}`) as Promise<Post>,

    store: (id: number, data: Omit<Post, "id">) =>
      client.put(`posts/${id}`, data) as Promise<Post>,

    delete: (id: number) => client.delete(`posts/${id}`, data),
  },
};
```

This kind of approach had its benefits - straightforward and easy to use e.g.

```ts
const posts = await api.posts.index();
```

However it's quite verbose and ends up with a non-insignificant amount of code being shipped to your users browser as your number of API endpoints grow.

## A better approach (I think)

This approach provides a conventional approach to defining an API's schema with compile-time only TypeScript types and the resulting JavaScript code is only 528 bytes.

Use `@davekit/typesafe-api` on the backend to define your API routes.

Use `@davekit/typesafe-api-client` on the frontend to create a lightweight wrapper around the Fetch API that consumes your API routes type and give you type safety when making requests to and receiving responses from your API.

## Examples

### Routes for a Laravel Resource Controller

```ts
import type { Post } from "./my-types";

export type ApiRoutes = {
  posts: {
    GET: {
      response: Post[];
    };
    POST: {
      body: Omit<Post, "id">;
      response: Post;
    };
  };
} & {
  [path in `posts/${number}`]: {
    GET: {
      response: Post[];
    };
    PUT: {
      body: Omit<Post, "id">;
      response: Post;
    };
    DELETE: {
      response: null;
    };
  };
};
```
