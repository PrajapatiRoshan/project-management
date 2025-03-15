import { HTTPSTATUS, HttpStatusCodeType } from '../config/http.config'; // Import HTTP status codes and types
import { ErrorCodeEnum, ErrorCodeEnumType } from '../enums/error-code.enum'; // Import error codes and types

export class AppError extends Error {
  // Define the AppError class
  public statusCode: HttpStatusCodeType; // Define the statusCode property
  public errorCode?: ErrorCodeEnumType; // Define the errorCode property

  constructor(
    // Constructor for the AppError class
    message: string, // The error message
    statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR, // The status code, default to INTERNAL_SERVER_ERROR
    errorCode?: ErrorCodeEnumType // The error code
  ) {
    super(message); // Call the parent class constructor
    this.statusCode = statusCode; // Set the statusCode property
    this.errorCode = errorCode; // Set the errorCode property
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace
  }
}

export class HttpException extends AppError {
  // Define the HttpException class
  constructor(
    // Constructor for the HttpException class
    message = 'Http Exception Error', // The error message, default to 'Http Exception Error'
    statusCode: HttpStatusCodeType, // The status code
    errorCode?: ErrorCodeEnumType // The error code
  ) {
    super(message, statusCode, errorCode); // Call the parent class constructor
  }
}

export class InternalServerException extends AppError {
  // Define the InternalServerException class
  constructor(message = 'Internal server error', errorCode?: ErrorCodeEnumType) {
    // Constructor for the InternalServerException class
    super(
      // Call the parent class constructor
      message, // The error message
      HTTPSTATUS.INTERNAL_SERVER_ERROR, // The status code, default to INTERNAL_SERVER_ERROR
      errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR // The error code, default to INTERNAL_SERVER_ERROR
    );
  }
}

export class NotFoundException extends AppError {
  // Define the NotFoundException class
  constructor(message = 'Resource not found', errorCode?: ErrorCodeEnumType) {
    // Constructor for the NotFoundException class
    super(
      // Call the parent class constructor
      message, // The error message
      HTTPSTATUS.NOT_FOUND, // The status code, default to NOT_FOUND
      errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND // The error code, default to RESOURCE_NOT_FOUND
    );
  }
}

export class BadRequestException extends AppError {
  // Define the BadRequestException class
  constructor(message = 'Bad Request', errorCode?: ErrorCodeEnumType) {
    // Constructor for the BadRequestException class
    super(
      // Call the parent class constructor
      message, // The error message
      HTTPSTATUS.BAD_REQUEST, // The status code, default to BAD_REQUEST
      errorCode || ErrorCodeEnum.VALIDATION_ERROR // The error code, default to VALIDATION_ERROR
    );
  }
}

export class UnauthorizedException extends AppError {
  // Define the UnauthorizedException class
  constructor(message = 'Unauthorized Access', errorCode?: ErrorCodeEnumType) {
    // Constructor for the UnauthorizedException class
    super(
      // Call the parent class constructor
      message, // The error message
      HTTPSTATUS.UNAUTHORIZED, // The status code, default to UNAUTHORIZED
      errorCode || ErrorCodeEnum.ACCESS_UNAUTHORIZED // The error code, default to ACCESS_UNAUTHORIZED
    );
  }
}

