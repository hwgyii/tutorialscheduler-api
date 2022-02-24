module.exports = {
  HTTP_CODES: {
    SUCCESS: 200,
    UNPROCESSABLE_ENTITY: 422,
    SERVER_ERROR: 500,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    NOT_ALLOWED: 405
  },
  ERROR_MESSAGES: {
    EMAIL_ALREADY_TAKEN: "Email already taken.",
    NO_USER_FOUND: "No user found.",
    INCORRECT_PASSWORD: "Password incorrect.",
    DEFAULT_SERVER_ERROR: "Ooops! Something went wrong on our side. Please contact your administrator.",
    NO_AUTHORIZED_ACCESS: "User has no authorized access for this feature.",
    NO_PRIVILEGES: "User does not have the proper privileges to access this feature.",
  },
  SUCCESS_MESSAGES: {
    TUTOR_REGISTERED: "Tutor has been registered.",
  }
}