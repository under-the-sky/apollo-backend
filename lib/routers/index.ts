import { Request, Response } from 'express';
import userRouter from './userRouter';
export class Routes {
  public routes(app): void {
    app.use('/api/v1', userRouter)
  }
}