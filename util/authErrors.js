const ERROR_MATCHES = [
  {
    match: /UserNotFoundException/,
    error: "UserNotFound",
  },
  {
    match: /User.already.exists/,
    error: "UserAlreadyExists",
  },
  {
    match: /User.is.already.confirmed/,
    error: "UserAlreadyConfirmed",
  },
  {
    match: /User.does.not.exist/,
    error: "UserDoesNotExist",
  },
  {
    match: /Incorrect.username.or.password/,
    error: "IncorrectCredentials",
  },
  {
    match: /User.is.not.confirmed/,
    error: "UserNotConfirmed",
  },
  {
    match: /InvalidParameterException/,
    error: "UserNotConfirmed",
  },
  {
    match: /LimitExceededException/,
    error: "LimitExceeded",
  },
  {
    match: /Password.not.long.enough/,
    error: "PasswordNotLongEnough",
  },
  {
    match: /ExpiredCodeException/,
    error: "ExpiredCode",
  },
  {
    match: /CodeMismatchException/,
    error: "InvalidCode",
  },
  {
    match: /UserNotFoundException/,
    error: "UserNotFound",
  },
  {
    match: /The.user.is.not.authenticated/,
    error: "NotAuthenticated",
  },
];

export const getAuthErrorMessage = (error, defaultError = "ServerError") => {
  if (!error) {
    console.log("not error:", error);
    return null;
  }

  const match = ERROR_MATCHES.find(({ match }) =>
    error.toString().match(match)
  );
  return match ? match.error : defaultError;
};
