export class HttpException extends Error {
  constructor(public statusCode: number, public message: string, public errors: Record<string, string[]> | null = null) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized access') {
    super(401, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden action') {
    super(403, message);
  }
}

export class BadRequestException extends HttpException {
  constructor(message = 'Bad request', errors: Record<string, string[]> | null = null) {
    super(400, message, errors);
  }
}

export class ConflictException extends HttpException {
  constructor(message = 'Conflict detected') {
    super(409, message);
  }
}
