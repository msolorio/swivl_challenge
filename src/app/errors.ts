class ServerError extends Error { }
class NotFoundError extends Error { }

class ExternalApiError extends ServerError { }
class SchemaValidationError extends ServerError { }
class OrgIdNotFoundError extends NotFoundError { }

export {
  ServerError,
  NotFoundError,
  ExternalApiError,
  SchemaValidationError,
  OrgIdNotFoundError
}
