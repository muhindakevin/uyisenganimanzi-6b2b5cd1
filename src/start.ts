import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// No bearer-token function middleware: the site uses its own admin session,
// and no server function relies on database sign-in. A browser database client
// here crashed every client-side server-function call on the published site.
export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
}));
