/* eslint-disable no-magic-numbers */
enum ResponseStatus {
  // Success Status
  SUCCESS_OK = 200,
  SUCCESS_CREATED = 201,

  // Redirecting Status

  // Client Error Status
  CERROR_UNAUTHORIZED = 401,
  CERROR_FORBIDDEN = 403,
  CERROR_NOTFOUND = 404,
  CERROR_UNPROCESSABLE = 422,

  // Server Error Status
  SERROR_INTERNAL = 500,
}

export default ResponseStatus
