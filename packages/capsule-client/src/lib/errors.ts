export class CapsuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CapsuleError";
    Object.setPrototypeOf(this, CapsuleError.prototype);
  }
}

export class CapsuleApiError extends CapsuleError {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data: any) {
    super(`API Error: ${message}`);
    this.name = "CapsuleApiError";
    this.statusCode = statusCode;
    this.data = data;
    Object.setPrototypeOf(this, CapsuleApiError.prototype);
  }
}

export class CapsuleNetworkError extends CapsuleError {
  request: any;

  constructor(message: string, request: any) {
    super(`Network Error: ${message}`);
    this.name = "CapsuleNetworkError";
    this.request = request;
    Object.setPrototypeOf(this, CapsuleNetworkError.prototype);
  }
}
