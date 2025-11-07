import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  CourseNotFoundError,
  CourseQuotaExceededError,
  InvalidSourceTextError,
  NotCourseOwnerError,
} from '../../features/courses/domain/errors/course.errors';
import {
  FlashcardNotFoundError,
  NotFlashcardOwnerError,
} from '../../features/flashcards/domain/errors/flashcard.errors';
import { SummaryNotFoundError } from '../../features/summaries/domain/errors/summary.errors';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Map domain errors to HTTP responses
    if (exception instanceof CourseQuotaExceededError) {
      status = HttpStatus.FORBIDDEN;
      message = exception.message;
    } else if (exception instanceof InvalidSourceTextError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (
      exception instanceof CourseNotFoundError ||
      exception instanceof FlashcardNotFoundError ||
      exception instanceof SummaryNotFoundError
    ) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (
      exception instanceof NotCourseOwnerError ||
      exception instanceof NotFlashcardOwnerError
    ) {
      status = HttpStatus.FORBIDDEN;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      // Keep original HTTP exceptions as is
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof Error) {
      // Log unexpected errors but don't expose details to client
      console.error(exception);
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
