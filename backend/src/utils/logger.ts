import { NextFunction, Request, Response } from 'express';

export const loggerMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const start = process.hrtime(); // Capture start time using process.hrtime()
  const currentDateTime = new Date().toLocaleString(); // Capture current date and time

  response.on('finish', () => {
    const fullPath = `${request.baseUrl}${request.path}`;
    if (!fullPath.includes('public')) {
      const end = process.hrtime(start); // Calculate duration using process.hrtime()
      const durationInMs = (end[0] * 1e9 + end[1]) / 1e6; // Convert duration to milliseconds

      console.log(
        `[${currentDateTime}] ${request.method} to ${request.baseUrl}${request.path}  - ${
          response.statusCode
        } -  ${durationInMs.toFixed(2)}ms`
      );
    }
  });

  next();
};
