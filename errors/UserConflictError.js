class UserConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Conflict';
    this.statusCode = 409;
  }
}

module.exports = UserConflictError;
