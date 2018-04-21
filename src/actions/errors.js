export const setLoginErrors = loginError => ({
  type: 'SET_LOGIN_ERROR',
  loginError
});

export const setSignUpErrors = signUpErrors => ({
  type: 'SET_SIGN_UP_ERRORS',
  signUpErrors
});

export const setPublishingError = publishingError => ({
  type: 'SET_ARTICLE_PUBLISHING_ERROR',
  publishingError
});

export const clearError = errorType => ({
  type: 'CLEAR_ERROR',
  errorType
});

