import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WinstonLoggerService } from './winston.logger';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: WinstonLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;
    const { statusCode } = res;

    this.logger.log(`Request: ${method} ${url} - Status: ${statusCode}`);
    next();
  }
}
