import { Responder } from "../utils/responder";
import { classToPlain, plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { sanitize } from 'class-sanitizer';
import * as express from 'express';

export default function validationMiddleware<T>(type: any, skipMissingProperties = false, whitelist = true): express.RequestHandler {
    return (request, response, next) => {
        const klass = plainToClass(type, request.body);
        sanitize(klass);
        validate(klass, { skipMissingProperties, whitelist })
            .then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    const message = errors.map((error: ValidationError) => {
                        if (error.constraints) {
                            return `[${error.property}] ${Object.values(error.constraints)}`
                        } else if (error.children) {
                            return error.children.map((childrenError: ValidationError) => {
                                return `[${error.property}.${childrenError.property}] ${Object.values(childrenError)}`
                            })
                        }
                    }).join('; ');
                    new Responder(request, response, next, false, 100, {message:message});
                } else {
                    request.body = classToPlain(klass);
                    next();
                }
            });
    };
}
