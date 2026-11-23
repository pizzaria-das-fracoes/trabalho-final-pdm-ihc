export class DomainError extends Error {
  readonly code: string;

  constructor(message: string, code = "DOMAIN_ERROR") {
    super(message);
    this.name = new.target.name;
    this.code = code;
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
  }
}

export class DataSourceError extends DomainError {
  constructor(message: string) {
    super(message, "DATASOURCE_ERROR");
  }
}

export class ActivityNotFoundError extends DomainError {
  constructor(message: string) {
    super(message, "ACTIVITY_NOT_FOUND");
  }
}
