import type { Request, Response, NextFunction } from 'express'
import { AppError } from '@repo/shared/common'

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: {
                message: err.message,
                code: err.code
            }
        })
    }

    // unexpected error — log it server side, don't leak details to client
    console.error(err)
    return res.status(500).json({
        error: {
            message: 'Something went wrong',
            code: 'INTERNAL'
        }
    })
}