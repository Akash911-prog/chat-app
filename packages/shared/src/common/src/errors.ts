export class AppError extends Error {
    constructor(
        public override message: string,
        public statusCode: number,
        public code: string, // machine-readable, useful for frontend
    ) {
        super(message);
    }
}

// pre-defined errors — no magic strings anywhere else in your code
export const ErrorCode = {
    // auth
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    // users
    USER_NOT_FOUND: "USER_NOT_FOUND",
    USERNAME_TAKEN: "USERNAME_TAKEN",
    // rooms
    ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
    ROOM_ALREADY_EXISTS: "ROOM_ALREADY_EXISTS",
    // general
    INTERNAL: "INTERNAL",
    NOT_FOUND: "NOT_FOUND",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export const Errors = {
    INVALID_CREDENTIALS: new AppError(
        "Invalid username or password",
        401,
        ErrorCode.INVALID_CREDENTIALS,
    ),
    UNAUTHORIZED: new AppError(
        "You must be logged in",
        401,
        ErrorCode.UNAUTHORIZED,
    ),
    FORBIDDEN: new AppError(
        "You do not have permission",
        403,
        ErrorCode.FORBIDDEN,
    ),
    USER_NOT_FOUND: new AppError(
        "User not found",
        404,
        ErrorCode.USER_NOT_FOUND,
    ),
    USERNAME_TAKEN: new AppError(
        "Username is already taken",
        409,
        ErrorCode.USERNAME_TAKEN,
    ),
    ROOM_NOT_FOUND: new AppError(
        "Room not found",
        404,
        ErrorCode.ROOM_NOT_FOUND,
    ),
    ROOM_ALREADY_EXISTS: new AppError(
        "A conversation already exists",
        409,
        ErrorCode.ROOM_ALREADY_EXISTS,
    ),
    INTERNAL: new AppError("Something went wrong", 500, ErrorCode.INTERNAL),
    NOT_FOUND: new AppError("Resource not found", 404, ErrorCode.NOT_FOUND),
} as const;
