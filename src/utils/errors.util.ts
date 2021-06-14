class ExtendableError extends Error {
  constructor(message: string) {
    if (new.target === ExtendableError) {
      throw new TypeError(
        'Abstract class "ExtendableError" cannot be instantiated directly.'
      );
    }
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400
export class BadRequest extends ExtendableError {
  constructor(message: string) {
    if (arguments.length === 0) {
      super("Bad request");
    } else {
      super(message);
    }
  }
}

// 401
export class Unauthorized extends ExtendableError {
  constructor(message: string) {
    if (arguments.length === 0) {
      super("Unaunthorized");
    } else {
      super(message);
    }
  }
}

// 403
export class Forbidden extends ExtendableError {
  constructor(message: string) {
    if (arguments.length === 0) {
      super("Forbidden");
    } else {
      super(message);
    }
  }
}

// 404
export class NotFound extends ExtendableError {
  constructor(message: string) {
    if (arguments.length === 0) {
      super("Not found");
    } else {
      super(message);
    }
  }
}

// 422
export class UnprocessableEntity extends ExtendableError {
  constructor(message: string) {
    if (arguments.length === 0) {
      super("Unprocessable entity");
    } else {
      super(message);
    }
  }
}

// 500
export class InternalServerError extends ExtendableError {
  constructor(message: string) {
    if (arguments.length === 0) {
      super("Internal server error");
    } else {
      super(message);
    }
  }
}
