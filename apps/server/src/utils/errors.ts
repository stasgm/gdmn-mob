/* eslint-disable max-classes-per-file */
class UnauthorizedError extends Error {}
class ForbiddenError extends Error {}
class NotFoundError extends Error {}
class ServerError extends Error {}

export const errors = {
  UnauthorizedError, // 401
  ForbiddenError, // 403
  NotFoundError, // 400
  ServerError, // 500
};
