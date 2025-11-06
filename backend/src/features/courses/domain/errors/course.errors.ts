export class CourseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class CourseQuotaExceededError extends CourseError {
  constructor(message = 'Course quota exceeded for this user') {
    super(message);
  }
}

export class InvalidSourceTextError extends CourseError {
  constructor(message = 'Invalid source text provided') {
    super(message);
  }
}

export class CourseNotFoundError extends CourseError {
  constructor(courseId: string) {
    super(`Course with id ${courseId} not found`);
  }
}

export class NotCourseOwnerError extends CourseError {
  constructor(message = 'You are not the owner of this course') {
    super(message);
  }
}
