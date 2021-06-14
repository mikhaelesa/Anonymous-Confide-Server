export const HTTPStatusCode = {
  code: {
    ok: 200,
    created: 201,
    noContent: 204,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    methodNotAllowed: 405,
    unprocessableEntity: 422,
    tooManyRequests: 429,
    internalServerError: 500,
  },
  status: {
    badRequest: "Bad request",
    unauthorized: "Unauthorized",
    forbidden: "Forbidden",
    notFound: "Not found",
    unprocessableEntity: "Unprocessable entity",
    internalServerError: "Internal server error",
  },
};
