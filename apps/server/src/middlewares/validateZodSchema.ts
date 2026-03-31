import { Errors } from "@repo/shared/common";
import type { Response, Request, NextFunction } from "express";
import { z, type ZodObject } from "zod";

export function validateSchema(schema: ZodObject) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            console.log(z.treeifyError(result.error));
            throw Errors.INVALID_CREDENTIALS;
        }

        req.body = result.data;
        next();
    };
}
