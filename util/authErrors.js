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
    match: /An.account.with.the.given.email.already.exists/,
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
    match: /UserNotConfirmedException/,
    error: "UserNotConfirmed",
  },
  {
    match: /Invalid.email.address.format/,
    error: "InvalidEmailFormat",
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
  {
    match: /there.is.no.registered\/verified.email.or.phone_number/,
    error: "UserNotConfirmed",
  },
];

export const getAuthErrorMessage = (error, defaultError = "ServerError") => {
  if (!error) {
    return null;
  }

  const match = ERROR_MATCHES.find(({ match }) =>
    error.toString().match(match)
  );
  return match ? match.error : defaultError;
};
