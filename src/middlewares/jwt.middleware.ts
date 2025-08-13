import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { appConfig } from "../config";

export interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

const jwtSecret = appConfig.jwtSecret;

export class JwtMiddleware {
  private static readonly secretKey = jwtSecret;

  static verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    // ambil token dari header
    // Bearer <token>
    const token = req.headers.authorization?.split(" ")[1];

    // jika token tidak ada, kirim error response
    if (!token) {
      res.status(401).send({
        message: "Authorization failed, token is missing",
      });
      return;
    }

    // verifikasi token
    jwt.verify(token, this.secretKey, (err, payload) => {
      if (err) {
        // jika token expired
        if (err instanceof TokenExpiredError) {
          res.status(401).send({
            message: "Token expired",
          });
          return;
        } else {
          // error selain expired
          res.status(401).send({
            message: "Token is invalid",
          });
          return;
        }
      }

      req.user = payload as JwtPayload;
      next();
    });
  };
}
