export const setLoginErrors = errors => ({
  type: 'SET_LOGIN_ERRORS',
  errors
});

export const setPublishingError = error => ({
  type: 'SET_ARTICLE_PUBLISHING_ERROR',
  error
});

export const clearError = errorType => ({
  type: 'CLEAR_ERROR',
  errorType
});

