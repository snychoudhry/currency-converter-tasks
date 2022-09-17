import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/http.exception';
 
function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
  const statusCode = error.status || 500;
  const message = error.message || 'Something went wrong';
  return response.status(statusCode).send({
    status:false,
    code:statusCode,
    message,
    data:{}
  })
}

export default errorMiddleware;