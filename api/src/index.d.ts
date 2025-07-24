declare module 'express' {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}