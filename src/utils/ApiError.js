class APiError extends Error {
  constructor(
    StatusCode,
    message = "something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.StatusCode = StatusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { APiError };